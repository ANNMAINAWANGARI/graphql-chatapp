import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

//Next we'll initialize ApolloClient, passing its constructor a configuration object with the uri and cache fields:
export  const httpLink = new HttpLink({
  uri: `http://localhost:4000/graphql`,
  credentials: "include",
});

export const client = new ApolloClient({
    link: httpLink,
    cache: new InMemoryCache(),
  });

