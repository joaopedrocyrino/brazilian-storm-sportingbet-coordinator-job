import { gql } from 'apollo-server'

import BetServices from '../../../services/bets'
import { GetManyBets } from '../../../dto'

const typeDefs = gql`
type Bet {
  id: Int!
  champId: Int!
  matchId: Int!
  better: String!
  betType: String!
}

input GetManyBets {
  better: String
}

extend type Query {
  getBets(input: GetManyBets!): [Bet]!
}
`

export default {
  resolvers: {
    Query: {
      getBets: async (
        root: any,
        { input }: { input: GetManyBets }
      ) => await BetServices.getMany(input)
    }
  },
  typeDefs: [typeDefs]
}
