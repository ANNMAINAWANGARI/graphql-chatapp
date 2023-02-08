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
import { GraphQLContext, Session } from './utils/types.js';
import { PrismaClient } from '@prisma/client';

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
const server = new ApolloServer({
  schema,
  plugins: [
    ApolloServerPluginDrainHttpServer({ httpServer })],
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
          return{prisma,session}}
      ,
  }),
);

await new Promise<void>((resolve) => httpServer.listen({ port: 4000 }, resolve));
console.log(`🚀 Server ready at http://localhost:4000/graphql`);
}
main()