import { CreateUsernameResponse, GraphQLContext } from "../../utils/types";

const resolvers = {
    Query:{
        searchUsers:()=>{}
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
                  
                return { success: true };
            }catch(error:any){
                console.log('createUsernameError',error)
                return{
                    error:error?.message
                }
            }
            
        }
    }
}
export default resolvers;