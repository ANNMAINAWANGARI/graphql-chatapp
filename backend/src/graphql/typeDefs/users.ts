import { ApolloServer } from '@apollo/server';

import { startStandaloneServer } from '@apollo/server/standalone'

const typeDefs = `#graphql
scalar Date

  type User {
    id: String
    username: String
  }
  type Query {
    searchUsers(username: String!): [User]
  }
  type Mutation {
    createUsername(username: String!): CreateUsernameResponse
  }
  type CreateUsernameResponse {
    success: Boolean
    error: String
  }
`
export default typeDefs;