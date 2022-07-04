import 'dotenv/config'
import Provider from '@truffle/hdwallet-provider'
import Web3 from 'web3'

import MatchesJson from '../../../artifacts/contracts/Matches.sol/Matches.json'

import { ChampionshipModel } from '../../data/models'
import { ChampionshipQuery } from '../../data/query'
import { CreateChampionship } from '../../dto'
import { createValidator } from './validators'
import Services from '..'

class ChampionshipServices extends Services {
  async create ({ token, ...req }: CreateChampionship): Promise<string> {
    await this.gateway({
      req,
      schema: createValidator,
      token,
      scope: true
    })

    const base = this.createBase()

    await ChampionshipQuery.create({ ...req, ...base })

    return base.id
  }

  async insertChampionships (token: string): Promise<boolean> {
    try {
      await this.gateway({
        token,
        scope: true
      })

      const championships = await ChampionshipQuery.getMany(
        undefined,
        { inserted: false, closed: false }
      )

      const provider = new Provider(process.env.COORDINATOR_PRIV_KEY, process.env.RPCURL)
      const web3 = new Web3(provider)

      // @ts-expect-error
      const contract = new web3.eth.Contract(MatchesJson.abi, process.env.MATCH_ADDRESS)

      const index: number = await contract.methods.champIds().call()

      await contract.methods.insertChampionships(championships.map(({ name, season, country }, i) => ({
        id: index + i,
        name,
        season,
        country,
        closed: false,
        openMatchIndex: 0
      }))).send({ from: process.env.COORDINATOR_ADDRESS })

      championships.forEach((c, i) => {
        c.inserted = true
        c.champId = index + i
      })

      await ChampionshipModel.save(championships)

      return true
    } catch (e) {
      console.log(e)
      return false
    }
  }
};

export default new ChampionshipServices()
