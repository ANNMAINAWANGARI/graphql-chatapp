import { GraphQLError } from "graphql";
import { ConversationPopulated, GraphQLContext } from "../../utils/types";
import { Prisma } from "@prisma/client";

const resolvers = {
    Query:{
      conversations: async function getConversations(_:any,__:any,context:GraphQLContext):Promise<Array<ConversationPopulated>>{
        const { session, prisma } = context;

      if (!session?.user) {
        throw new GraphQLError("Not authorized");
      }
      
      try{
        const { id } = session.user;
        const conversations = await prisma.conversation.findMany({
          /**
           * Below has been confirmed to be the correct
           * query by the Prisma team. Has been confirmed
           * that there is an issue on their end
           * Issue seems specific to Mongo
           */
          // where: {
          //   participants: {
          //     some: {
          //       userId: {
          //         equals: id,
          //       },
          //     },
          //   },
          // },
          include: conversationPopulated,
        });
        /**
         * Since above query does not work
         */
        return conversations.filter(
          (conversation) =>
            !!conversation.participants.find((p) => p.userId === id)
        );
      }catch(error:any){
        console.log("ConversationQueryerror", error);
        throw new GraphQLError(error?.message);
      }
      }
    },
    Mutation:{
        createConversation:async(_:any,args:{participantIds:Array<string>},context:GraphQLContext):Promise<{conversationId:string}>=>{
            const {participantIds} = args;
            const {session,prisma} = context;
            if (!session?.user) {
                throw new GraphQLError("Not authorized");
              }
        
              const { id: userId } = session.user;
              try{
                const conversation =await prisma.conversation.create({
                    data:{
                      participants: {
                        createMany: {
                          data: participantIds.map((id) => ({
                            userId: id,
                            hasSeenLatestMessage: id === userId,
                          })),
                        },
                      },
                    },
                    include: conversationPopulated
                    })
                    return {
                      conversationId:conversation.id
                    }
              }catch(error:any){
                console.log("createConversation error", error);
                throw new GraphQLError("Error creating conversation");
              }
            console.log('conversation resolver')
            console.log('args',args.participantIds)
        }
    }
}
export const participantPopulated =
  Prisma.validator<Prisma.ConversationParticipantInclude>()({
    user: {
      select: {
        id: true,
        username: true,
      },
    },
  });
export const conversationPopulated =
  Prisma.validator<Prisma.ConversationInclude>()({
    participants: {
      include: participantPopulated,
    },
    latestMessage: {
      include: {
        sender: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    },
  });
export default resolvers;
