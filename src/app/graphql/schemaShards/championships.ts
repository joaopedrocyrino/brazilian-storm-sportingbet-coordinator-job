import { gql } from 'apollo-server'

import ChampionshipServices from '../../../services/championship'
import { CreateChampionship } from '../../../dto'

const typeDefs = gql`
type Championship {
  id: ID!
  name: String!
  season: Int!
  inserted: Boolean!
  closed: Boolean!
  country: String!
}

input CreateChampionship {
  name: String!
  season: Int!
  country: String!
  token: String!
}

extend type Mutation {
  createChampionship(input: CreateChampionship!): String
  insertChampionships(token: String!): Boolean!
}
`

export default {
  resolvers: {
    Mutation: {
      createChampionship: async (
        root: any,
        { input }: { input: CreateChampionship }
      ) => await ChampionshipServices.create(input),
      insertChampionships: async (
        root: any,
        { token }: { token: string }
      ) => await ChampionshipServices.insertChampionships(token)
    }
  },
  typeDefs: [typeDefs]
}
