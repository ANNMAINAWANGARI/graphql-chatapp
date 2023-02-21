import { ConversationPopulated } from "../../../backend/src/utils/types";

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