// npm install @apollo/server express graphql cors body-parser
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import express from 'express';
import http from 'http';
import cors from 'cors';
import typeDefs from './graphql/typeDefs/index.js'
import { makeExecutableSchema } from '@graphql-tools/schema';
import resolvers from './graphql/resolvers/index.js';
import * as dotenv from 'dotenv';
import {getSession} from 'next-auth/react'
import { GraphQLContext, Session, SubscriptionContext } from './utils/types.js';
import { PrismaClient } from '@prisma/client';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/lib/use/ws';
import { PubSub } from "graphql-subscriptions";

interface MyContext {
  token?: String;
}



async function main(){
dotenv.config();
const app = express();
const httpServer = http.createServer(app);
const schema = makeExecutableSchema({
  typeDefs,
  resolvers
})
const prisma = new PrismaClient()
const pubsub = new PubSub();
// Creating the WebSocket server
const wsServer = new WebSocketServer({
  // This is the `httpServer` we created in a previous step.
  server: httpServer,
  // Pass a different path here if app.use
  // serves expressMiddleware at a different path
  path: '/graphql/subscriptions',
});

// Hand in the schema we just created and have the
// WebSocketServer start listening.
const serverCleanup = useServer({ schema ,context:async(ctx:SubscriptionContext):Promise<GraphQLContext>=>{
  if (ctx.connectionParams && ctx.connectionParams.session) {
    const { session } = ctx.connectionParams;
    return { session, prisma,pubsub };
  }
  // Otherwise let our resolvers know we don't have a current user
  return { session: null, prisma,pubsub};
}}, wsServer);
const server = new ApolloServer({
  schema,
  plugins: [
    ApolloServerPluginDrainHttpServer({ httpServer }),
    {
      async serverWillStart() {
        return {
          async drainServer() {
            await serverCleanup.dispose();
          },
        };
      },
    },
  ],
    
});
await server.start();
app.use('/graphql',
  cors<cors.CorsRequest>({
    origin:process.env.CLIENT_ORIGIN,
    credentials:true
  }),
  express.json(),
  expressMiddleware(server, {
    context: async ({ req,res }):Promise<GraphQLContext> => 
      { 
        const session = (await getSession({ req })) as unknown as Session
          return{prisma,session,pubsub}}
      ,
  }),
);

await new Promise<void>((resolve) => httpServer.listen({ port: 4000 }, resolve));
console.log(`🚀 Server ready at http://localhost:4000/graphql`);
}
main().catch((err) => console.log(err));