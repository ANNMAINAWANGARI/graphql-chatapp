import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';
import { split } from '@apollo/client';

import { getMainDefinition } from '@apollo/client/utilities';
import { getSession } from 'next-auth/react';



//Next we'll initialize ApolloClient, passing its constructor a configuration object with the uri and cache fields:
export  const httpLink = new HttpLink({
  uri: `http://localhost:4000/graphql`,
  credentials: "include",
});



const wsLink = typeof window !=='undefined' ? new GraphQLWsLink(createClient({
  url: 'ws://localhost:4000/graphql/subscriptions',
  connectionParams:async ()=>({
    session: await getSession()
  })
})): null

const link =
  typeof window !== "undefined" && wsLink != null
    ? split(
        ({ query }) => {
          const def = getMainDefinition(query);
          return (
            def.kind === "OperationDefinition" &&
            def.operation === "subscription"
          );
        },
        wsLink,
        httpLink
      )
    : httpLink

    export const client = new ApolloClient({
      link,
      cache: new InMemoryCache(),
    });