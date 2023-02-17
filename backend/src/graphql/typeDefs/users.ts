import { ApolloServer } from '@apollo/server';

import { startStandaloneServer } from '@apollo/server/standalone'

const typeDefs = `#graphql
scalar Date

  type SearchedUser {
    id: String
    username: String
  }
  type Query {
    searchUsers(username: String!): [SearchedUser]
  }
  type Mutation {
    createUsername(username: String!): CreateUsernameResponse
  }
  type CreateUsernameResponse {
    success: Boolean
    error: String
  }
  type User{
    id: String
    username: String
    email:String
    emailVerified:Boolean
    name:String
    image:String
  }
`
export default typeDefs;