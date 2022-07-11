import Provider from '@truffle/hdwallet-provider'
import moment from 'moment'
import Web3 from 'web3'

import BrazilianStorm from '../artifacts/contracts/BrazilianStorm.sol/BrazilianStormSportingbet.json'
import MatchesJson from '../artifacts/contracts/Matches.sol/Matches.json'
import BetJson from '../artifacts/contracts/Bets.sol/Bets.json'

import { createValidator, fullfillValidator } from './validators'
import { CreateMatch, FullfillResults } from '../../dto'
import { MatchQuery } from '../../data/query'
import { ZK } from '../../frameworks'
import Services from '..'

class MatchServices extends Services {
  async create ({ token, ...req }: CreateMatch): Promise<string> {
    await this.gateway({
      schema: createValidator,
      scope: true,
      token,
      req
    })

    const base = this.createBase()

    await MatchQuery.create({ ...req, ...base })

    return base.id
  }

  async insertMatches (token: string): Promise<boolean> {
    try {
      await this.gateway({
        token,
        scope: true
      })

      const matches = await MatchQuery.getToInsert()

      const provider = new Provider(process.env.COORDINATOR_PRIV_KEY, process.env.RPCURL)
      const web3 = new Web3(provider)
      // @ts-expect-error
      const matchContract = new web3.eth.Contract(MatchesJson.abi, process.env.MATCH_ADDRESS)

      const insertData: {
        [k: number]: Array<{
          id: string
          house: string
          visitor: string
          start: number
          houseGoals: number
          visitorGoals: number
          closed: boolean
          resultsFullfilled: boolean
        }>
      } = {}

      matches.forEach(({ house, start, visitor, champId }) => {
        const record = {
          house,
          start: moment(start).unix(),
          visitor,
          houseGoals: 0,
          visitorGoals: 0,
          closed: false,
          resultsFullfilled: false
        }

        if (insertData[champId]) {
          insertData[champId].push(record)
        } else {
          insertData[champId] = [record]
        }
      })

      await Promise.all(Object.keys(insertData).map(async k => {
        await matchContract.methods.insertMatches(k, insertData[k]).send({ from: process.env.COORDINATOR_ADDRESS })
      }))

      await MatchQuery.insert(matches.map(m => m.id))

      return true
    } catch (e) {
      console.log(e)
      return false
    }
  }

  async fullfillResults ({ token, ...req }: FullfillResults): Promise<any> {
    await this.gateway({
      schema: fullfillValidator,
      scope: true,
      token,
      req
    })

    await MatchQuery.fullfillResults(req.id, req.house, req.visitor)

    return true
  }

  async fullfillAndClose (token: string): Promise<boolean> {
    try {
      await this.gateway({
        token,
        scope: true
      })

      const matchesToFullfill = await MatchQuery.getToFullfill()

      const provider = new Provider(process.env.COORDINATOR_PRIV_KEY, process.env.RPCURL)
      const web3 = new Web3(provider)
      // @ts-expect-error
      const matchContract = new web3.eth.Contract(MatchesJson.abi, process.env.MATCH_ADDRESS)

      await matchContract.methods.fullfillResults(matchesToFullfill.map(({ house, visitor, champId, matchId }) => ({
        house,
        visitor,
        champId,
        matchId
      }))).send({ from: process.env.COORDINATOR_ADDRESS })

      // @ts-expect-error
      const betContract = new web3.eth.Contract(BetJson.abi, process.env.BET_ADDRESS)
      // @ts-expect-error
      const brazilianContract = new web3.eth.Contract(BrazilianStorm.abi, process.env.BRAZILIAN_ADDRESS)

      const closeMatches = []

      await Promise.all(matchesToFullfill.map(async ({ house, visitor, champId, matchId }) => {
        const bets = await betContract.methods.getMatchBets(champId, matchId).call()

        let winnerLost: bigint = 0n
        let winner: bigint = 0n
        let scoreLost: bigint = 0n
        let score: bigint = 0n
        let goalsLost: bigint = 0n
        let goals: bigint = 0n

        await Promise.all([
          await Promise.all(bets.winner.map(async (w: any) => {
            const { pubKey }: { pubKey: Uint8Array[] } = await brazilianContract.methods.users(w.better).call()
            const sharedSecret = await ZK.genEcdhSharedKey(pubKey)
            const value = await ZK.decrypt(w.value, sharedSecret)

            if ((w.house && house > visitor) || (!w.house && house < visitor)) {
              winner += value
            } else { winnerLost += value }
          })),
          await Promise.all(bets.score.map(async (s: any) => {
            const { pubKey }: { pubKey: Uint8Array[] } = await brazilianContract.methods.users(s.better).call()
            const sharedSecret = await ZK.genEcdhSharedKey(pubKey)
            const value = await ZK.decrypt(s.value, sharedSecret)

            if (s.house === house && s.visitor === visitor) {
              score += value
            } else { scoreLost += value }
          })),
          await Promise.all(bets.goals.map(async (g: any) => {
            const { pubKey }: { pubKey: Uint8Array[] } = await brazilianContract.methods.users(g.better).call()
            const sharedSecret = await ZK.genEcdhSharedKey(pubKey)
            const value = await ZK.decrypt(g.value, sharedSecret)

            if ((g.house && house === g.goals) || (!g.house && visitor === g.goals)) {
              goals += value
            } else { goalsLost += value }
          }))
        ])

        const winnerFee = winnerLost / 10n
        const scoreFee = scoreLost / 10n
        const goalsFee = goalsLost / 10n

        closeMatches.push({
          champId,
          matchId,
          winnerMultiplier: (winnerLost - winnerFee) / winner,
          scoreMultiplier: (scoreLost - scoreFee) / score,
          goalsMultiplier: (goalsLost - goalsFee) / goals,
          coordinatorFee: winnerFee + scoreFee + goalsFee
        })
      }))

      await matchContract.methods.closeMatches(closeMatches)

      await MatchQuery.close(matchesToFullfill.map(m => m.id))

      return true
    } catch { return false }
  }
};

export default new MatchServices()
