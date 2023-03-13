import { ConversationPopulated, MessagePopulated } from "../../../backend/src/utils/types";

export interface CreateUsernameVariables {
    username: string;
  }
  
 export interface CreateUsernameData {
    createUsername: {
      success: boolean;
      error: string;
    };
  }

  export interface SearchUsersInput{
    username:string;
  }
  export interface SearchedUsers{
    id:string;
    username:string;
  }

  export interface SearchUsersData{
    searchUsers:Array<SearchedUsers>
  }

  //conversations
  export interface CreateConversationData {
    createConversation: {
      conversationId: string;
    };
  }
  export interface CreateConversationInput {
    participantIds :Array<string>
  }
  export interface ConversationsData {
    conversations: Array<ConversationPopulated>;
  }
  export interface ConversationCreatedSubscriptionData {
    subscriptionData: {
      data: {
        conversationCreated: ConversationPopulated;
      };
    };
  }
  /**
 * Messages
 */
  export interface SendMessageVariables {
    id: string;
    conversationId: string;
    senderId: string;
    body: string;
  }
export interface MessagesData {
  messages: Array<MessagePopulated>;
}

export interface MessagesVariables {
  conversationId: string;
}

export interface MessageSubscriptionData {
  subscriptionData: {
    data: {
      messageSent: MessagePopulated;
    };
  };
}
export interface ConversationUpdatedData {
  conversationUpdated: {
    conversation: Omit<ConversationPopulated, "latestMessage"> & {
      latestMessage: MessagePopulated;
    };
    addedUserIds: Array<string> | null;
    removedUserIds: Array<string> | null;
  };
}