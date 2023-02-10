import { gql } from '@apollo/client';

/* eslint import/no-anonymous-default-export:  */
export default {
    Queries: {
      searchUsers: gql`
        query SearchUsers($username: String!) {
          searchUsers(username: $username) {
            id
            username
          }
        }
      `,
    },
    Mutations: {
      createUsername: gql`
        mutation CreateUsername($username: String!) {
          createUsername(username: $username) {
            success
            error
          }
        }
      `,
    },
    Subscriptions: {},
  };