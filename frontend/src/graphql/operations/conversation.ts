import { gql } from '@apollo/client';
const conversationFields =`
          id
          participants{
            user {
             id
             username
            }
            hasSeenLatestMessage
          }
          updatedAt
          latestMessage{
            id
            sender{
              id
              username
            }
            body
            createdAt
          }
`

/* eslint import/no-anonymous-default-export:  */
export default {
    Mutations: {
        createConversation:gql`
        mutation CreateConversation($participantIds: [String]!) {
        createConversation(participantIds: $participantIds) {
          conversationId
        }
      }
        `
    },
    Queries:{
      conversations:gql`
       query Conversations {
        conversations{
          ${conversationFields}
        }
       }
      `
    },
    Subscriptions:{
      conversationCreated:gql`
       subscription ConversationCreated{
        conversationCreated{
          ${conversationFields}
        }
       }
      `
    }
}