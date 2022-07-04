import { gql } from 'apollo-server'

import TeamServices from '../../../services/team'
import { CreateTeam } from '../../../dto'

const typeDefs = gql`
type Team {
  id: ID!
  acro: String!
  name: String!
  city: String!
  country: String!
}

input CreateTeam {
  acro: String!
  name: String!
  city: String!
  country: String!
  token: String!
}

extend type Mutation {
  createTeam(input: CreateTeam!): String
}
`

export default {
  resolvers: {
    Mutation: {
      createTeam: async (
        root: any,
        { input }: { input: CreateTeam }
      ) => await TeamServices.create(input)
    }
  },
  typeDefs: [typeDefs]
}
