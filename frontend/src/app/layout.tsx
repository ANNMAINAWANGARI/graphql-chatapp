"use client";
import AuthContext from "./AuthContext";
import { ChakraProvider } from '@chakra-ui/react'
import {theme} from '../chakra/theme'
import { ApolloProvider } from "@apollo/client";
import { client } from "@/graphql/apollo-client";

export default function RootLayout({
  children,
  
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      {/*
        <head /> will contain the components returned by the nearest parent
        head.tsx. Find out more at https://beta.nextjs.org/docs/api-reference/file-conventions/head
      */}
      <head />
      <body>
      <ApolloProvider client={client}>
        <AuthContext>
        <ChakraProvider theme={theme}>{children}</ChakraProvider>
        </AuthContext>
      </ApolloProvider>
      </body>
    </html>
  )
}
