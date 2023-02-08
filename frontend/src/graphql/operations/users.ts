import { gql } from '@apollo/client';

// //Define Query
// const Search_Users = gql`
//  query SearchUsers($username: String!){
//     searchUsers(username: $username) {
//           id
//           username
//         }
//  }
// `

// // Define mutation
//  const createUsername = gql`
//  mutation CreateUsername($username: String!) {
//         createUsername(username: $username) {
//           success
//           error
//         }
//       }


// `;
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