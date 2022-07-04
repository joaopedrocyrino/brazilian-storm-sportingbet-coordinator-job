import 'dotenv/config'
import Provider from '@truffle/hdwallet-provider'
import Web3 from 'web3'

import BetsJson from '../../../artifacts/contracts/Bets.sol/Bets.json'
import { GetManyBets } from '../../dto'
import Services from '..'

class BetsServices extends Services {
  async getMany (input: GetManyBets): Promise<Array<{
    id: number
    champId: number
    matchId: number
    better: string
    betType: string
  }>> {
    const provider = new Provider(process.env.COORDINATOR_PRIV_KEY, process.env.RPCURL)
    const web3 = new Web3(provider)

    // @ts-expect-error
    const contract = new web3.eth.Contract(BetsJson.abi, process.env.BET_ADDRESS)

    const events = await contract.getPastEvents('BetInserted', {
      fromBlock: 0,
      toBlock: 'latest'
    })

    if (input.better) {
      return events.filter(e => BigInt(e.returnValues.better) === BigInt(input.better))
        .map(({ returnValues: { id, champId, matchId, better, betType } }) => ({
          id,
          champId,
          matchId,
          better,
          betType
        }))
    } else {
      return events.map(({ returnValues: { id, champId, matchId, better, betType } }) => ({
        id,
        champId,
        matchId,
        better,
        betType
      }))
    }
  }
};

export default new BetsServices()
