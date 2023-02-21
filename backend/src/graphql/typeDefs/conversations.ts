
const typeDefs = `#graphql
scalar Date
  type Conversation {
    id: String
    latestMessage: Message
    participants: [Participant]
    updatedAt: Date
    createdAt: Date
  }
  type Participant {
    id: String
    user: User
    hasSeenLatestMessage: Boolean
  }
  type CreateConversationResponse {
    conversationId: String
  }
  # type ConversationDeletedResponse {
  #   id: String
  # }
  # type ConversationUpdatedSubscriptionPayload {
  #   conversation: Conversation
  #   addedUserIds: [String]
  #   removedUserIds: [String]
  # }
  
  type Query {
    conversations: [Conversation]
  }
  type Mutation {
    createConversation(participantIds: [String]): CreateConversationResponse
  }
  # type Mutation {
  #   markConversationAsRead(userId: String!, conversationId: String!): Boolean
  # }
  # type Mutation {
  #   deleteConversation(conversationId: String!): Boolean
  # }
  # type Mutation {
  #   updateParticipants(
  #     conversationId: String!
  #     participantIds: [String]!
  #   ): Boolean
  # }
  type Subscription {
    conversationCreated: Conversation
  }
  # type Subscription {
  #   conversationUpdated: ConversationUpdatedSubscriptionPayload
  # }
  # type Subscription {
  #   conversationDeleted: ConversationDeletedResponse
  # }
`;

export default typeDefs;