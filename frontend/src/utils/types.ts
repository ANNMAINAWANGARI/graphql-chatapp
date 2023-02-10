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
    searchedUsers:Array<SearchedUsers>
  }