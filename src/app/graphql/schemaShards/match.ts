import { gql } from 'apollo-server'

import MatchServices from '../../../services/match'
import { CreateMatch, FullfillResults } from '../../../dto'

const typeDefs = gql`
type Match {
  id: ID!
  championshipId: ID!
  houseId: ID!
  visitorId: ID!
  houseGoals: Int!
  visitorGoals: Int!
  start: String!
  end: String!
  inserted: Boolean!
  closed: Boolean!
  matchId: Int
}

input CreateMatch {
  champId: ID!
  houseId: ID!
  visitorId: ID!
  start: String!
  end: String!
  token: String!
}

input Fullfill {
  id: ID!
  house: Int!
  visitor: Int!
  token: String!
}

extend type Mutation {
  createMatch(input: CreateMatch!): String!
  fullfillMatch(input: Fullfill!): Boolean!
  insertMatches(token: String!): Boolean!
  closeMatches(token: String!): Boolean!
}
`

export default {
  resolvers: {
    Mutation: {
      createMatch: async (
        root: any,
        { input }: { input: CreateMatch }
      ) => await MatchServices.create(input),
      fullfillMatch: async (
        root: any,
        { input }: { input: FullfillResults }
      ) => await MatchServices.fullfillResults(input),
      insertMatches: async (
        root: any,
        { token }: { token: string }
      ) => await MatchServices.insertMatches(token),
      closeMatches: async (
        root: any,
        { token }: { token: string }
      ) => await MatchServices.fullfillAndClose(token)
    }
  },
  typeDefs: [typeDefs]
}
