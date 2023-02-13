import { gql } from '@apollo/client';

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
    }
}