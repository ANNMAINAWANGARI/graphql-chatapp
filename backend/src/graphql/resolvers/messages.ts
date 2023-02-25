import { GraphQLError } from "graphql";
import { GraphQLContext, MessagePopulated, MessageSentSubscriptionPayload, SendMessageArguments } from "../../utils/types";
import { Prisma } from "@prisma/client";
import { withFilter } from "graphql-subscriptions";
import { conversationPopulated } from "./conversation.js";
import { userIsConversationParticipant } from "../../utils/functions.js";

const resolvers = {
    Query: {
        messages:async(
            _: any,
            args: { conversationId: string },
            context: GraphQLContext
        ):Promise<Array<MessagePopulated>>=>{
            const { session, prisma } = context;
            const { conversationId } = args;

            if (!session?.user) {
             throw new GraphQLError("Not authorized");
            }
           const {user: { id: userId },} = session;
        
           /**
       * Verify that conversation exists & user is a participant
       */
      const conversation = await prisma.conversation.findUnique({
        where: {
          id: conversationId,
        },
        include: conversationPopulated,
      });
      if (!conversation) {
        throw new GraphQLError("Conversation Not Found");
      }
      const allowedToView = userIsConversationParticipant(
        conversation.participants,
        userId
      )
      if (!allowedToView) {
        throw new GraphQLError("Not Authorized");
      }
      try {
        const messages = await prisma.message.findMany({
          where: {
            conversationId,
          },
          include: messagePopulated,
          orderBy: {
            createdAt: "desc",
          },
        });
        // return [{body:'Hey dude'} as MessagePopulated]
        return messages;
      } catch (error: any) {
        console.log("messages error", error);
        throw new GraphQLError(error?.message);
      }
    }
    },
    Mutation:{
        sendMessage:async(_:any,args:SendMessageArguments,context:GraphQLContext):Promise<boolean>=>{
            const { session, prisma, pubsub } = context;
            const { id: messageId, senderId, conversationId, body } = args;
            if (!session?.user) {
                throw new GraphQLError("Not authorized");
              }
        
              const { id: userId } = session.user;
              if (userId !== senderId) {
                throw new GraphQLError("Not authorized");
              }
              console.log("HERE IS DATA", args);
              
            try{
                const newMessage = await prisma.message.create({
                    data:{
                        id: messageId,
                        senderId,
                        conversationId,
                        body,
                    }, 
                    include:messagePopulated
                })
                 /**
         * Find ConversationParticipant entity
         */
        const participant = await prisma.conversationParticipant.findFirst({
          where: {
            userId,
            conversationId,
          },
        });

        /**
         * Should always exist
         */
        if (!participant) {
          throw new GraphQLError("Participant does not exist");
        }

        console.log("HERE IS PARTICIPANT", participant);
                  /**
         * Update conversation entity
         */
        const conversation = await prisma.conversation.update({
            where: {
              id: conversationId,
            },
            data: {
              latestMessageId: newMessage.id,
              participants: {
                update: {
                  where: {
                    id: participant.id,
                  },
                  data: {
                    hasSeenLatestMessage: true,
                  },
                },
                updateMany: {
                  where: {
                    NOT: {
                      userId,
                    },
                  },
                  data: {
                    hasSeenLatestMessage: false,
                  },
                },
              },
            },
            include: conversationPopulated,
          });
          pubsub.publish("MESSAGE_SENT", { messageSent: newMessage })
                return true
            }catch(error:any){
                console.log('sendMessageError',error)
            }
        }
    },
    Subscription:{
        messageSent:{
            subscribe: withFilter(
                (_: any, __: any, context: GraphQLContext)=>{
                    const { pubsub } = context;
          return pubsub.asyncIterator(["MESSAGE_SENT"]);
                },(
                    payload: MessageSentSubscriptionPayload,
                    args: { conversationId: string },
                    context: GraphQLContext
                )=>{
                    return payload.messageSent.conversationId === args.conversationId;
                }
            )
        }
    }
}
export const messagePopulated = Prisma.validator<Prisma.MessageInclude>()({
    sender:{
        select:{
            id:true,
            username:true
        }
    }
})
export default resolvers;