import { GraphQLError } from "graphql";
import { ConversationPopulated, ConversationUpdatedSubscriptionPayload, GraphQLContext } from "../../utils/types";
import { Prisma } from "@prisma/client";
import { withFilter } from "graphql-subscriptions";
import { userIsConversationParticipant } from "../../utils/functions.js";



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
            const {session,prisma,pubsub} = context;
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
                    pubsub.publish('CONVERSATION_CREATED',{conversationCreated:conversation})
                    return {
                      conversationId:conversation.id
                    }
              }catch(error:any){
                console.log("createConversation error", error);
                throw new GraphQLError("Error creating conversation");
              }
            
        },
        markConversationAsRead:async( _: any,args: { userId: string; conversationId: string },context: GraphQLContext):Promise<boolean>=>{
          const { session, prisma } = context;
          const { userId, conversationId } = args;

          if (!session?.user) {
            throw new GraphQLError("Not authorized");
          }
          try{
            const participant = await prisma.conversationParticipant.findFirst({
              where: {
                userId,
                conversationId,
              },
            });
             /*** Should always exists but being safe*/
            if (!participant) {
             throw new GraphQLError("Participant entity not found");
            }
            await prisma.conversationParticipant.update({
              where: {
                id: participant.id,
              },
              data: {
                hasSeenLatestMessage: true,
              },
            });
            return true
          }catch(error:any){
            console.log("markConversationAsRead error", error);
            throw new GraphQLError(error?.message);
          }
        }
    },
    
    Subscription:{
      conversationCreated:{
        
        subscribe:withFilter((_:any,__any,context:GraphQLContext)=>{
          const { pubsub } = context;
          console.log('conversation created')
          return pubsub.asyncIterator(['CONVERSATION_CREATED']);
        },(payload:ConversationCreatedSubscriptionPayload, _,context:GraphQLContext)=>{
          const { session } = context;
          const {conversationCreated:{participants}} = payload;
          // const userIsParticipant = !!participants.find((p)=>(p.userId ===session.user.id))
          const userIsParticipant = userIsConversationParticipant(
            participants,
            session.user.id
          );
          return userIsParticipant;
        })
      },
      conversationUpdated:{
       subscribe:withFilter(
        (_:any,__any,context:GraphQLContext)=>{
          const { pubsub } = context;
          console.log('conversation updated')
          return pubsub.asyncIterator(['CONVERSATION_UPDATED']);
        },(payload: ConversationUpdatedSubscriptionPayload, _: any,context: GraphQLContext)=>{
            const { session } = context;
            console.log('conversation updatedPayload',payload)
          if (!session?.user) {
            throw new GraphQLError("Not authorized");
          }
          const { id: userId } = session.user;
          const {
            conversationUpdated: {
              conversation: { participants },
            },
          } = payload;
          return userIsConversationParticipant(participants, userId);
          }
       )
      }
    }
}
export const participantPopulated = Prisma.validator<Prisma.ConversationParticipantInclude>()({
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
  export interface ConversationCreatedSubscriptionPayload {
    conversationCreated: ConversationPopulated;
  }
export default resolvers;
