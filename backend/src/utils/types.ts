import { Prisma, PrismaClient } from "@prisma/client";
// import { PubSub } from "graphql-subscriptions"
// import {Session} from 'next-auth'

export interface Session {
    user: User;
}


export interface GraphQLContext {
    session: Session | null
    prisma: PrismaClient
    // pubsub: PubSub;
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