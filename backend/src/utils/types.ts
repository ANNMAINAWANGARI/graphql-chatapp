import { Prisma, PrismaClient } from "@prisma/client";
import { PubSub } from "graphql-subscriptions"
// import {Session} from 'next-auth'
import {
  conversationPopulated,
  participantPopulated,
} from "../graphql/resolvers/conversation";
import { Context } from "graphql-ws/lib/server";

export interface Session {
    user: User;
}


export interface GraphQLContext {
    session: Session | null
    prisma: PrismaClient
    pubsub: PubSub;
  }
// User Interface Start
export interface User {
    id: string;
    username: string;
    email:string;
    image:string;
    name:string;
    emailVerified:boolean;
  }

export interface CreateUsernameResponse {
    success?: Boolean
    error?: String
  }
// User Interface End
//This will allow Prisma to generate the conversationPopulated type instead of creating it manually
export type ConversationPopulated = Prisma.ConversationGetPayload<{
  include: typeof conversationPopulated;
}>;
export type ParticipantPopulated = Prisma.ConversationParticipantGetPayload<{
  include: typeof participantPopulated;
}>;

export interface SubscriptionContext extends Context {
  connectionParams: {
    session?: Session;
  };
}