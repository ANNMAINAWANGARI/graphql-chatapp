import { User } from "@prisma/client";
import { GraphQLError } from "graphql";
import { CreateUsernameResponse, GraphQLContext } from "../../utils/types";
//import { User } from "@prisma/client";

const resolvers = {
    Query:{
        searchUsers:async(_:any,args:{username:string},context:GraphQLContext):Promise<Array<User>>=>{
          const { session, prisma } = context;
          const {username:searchedUsername} = args;
          
          const {
            user: { username: myUsername },
          } = session;
          if (!session?.user) {
            throw new GraphQLError("Not authorized");
          }
          try{
            const users = await prisma.user.findMany({
              where: {
                username: {
                  contains: searchedUsername,
                  not: myUsername,
                  mode: "insensitive",
                },
              },
            });
    
            return users;
          }catch(error){
            throw new GraphQLError(error?.message);
          }
          console.log('search users',args.username)
        }
    },
    Mutation:{
        createUsername:async(_:any,args:{username:string},context:GraphQLContext):Promise<CreateUsernameResponse>=>{
            const { session, prisma } = context;
            const {username} = args;
            if (!session?.user) {
                return {
                  error: "Not authorized",
                };
              }
            const {id:userId}= session.user;
            try{
                const existingUser = await prisma.user.findUnique({
                    where: {
                     username,
                    },
                  });
                  if (existingUser) {
                    return {
                      error: "Username already taken. Try another",
                    };
                  }
                  /*** update username*/
                  await prisma.user.update({
                    where: {
                        id: userId,
                      },
                      data: {
                        username,
                      }
                  })
                  console.log('createUsernameSuccess')
                return { success: true };
            }catch(error:any){
                console.log('createUsernameError',error)
                return{
                    error:error
                }
            }
            
        }
    }
}
export default resolvers;