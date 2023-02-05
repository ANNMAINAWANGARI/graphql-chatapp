"use client";
import Image from 'next/image'
import { Inter } from '@next/font/google'
import {signIn, signOut, useSession,getSession} from 'next-auth/react'
import {theme} from '../chakra/theme'
import { NextPageContext } from 'next';
import Auth from '@/components/Auth';
import Chat from '@/components/Chat';
import { Box } from '@chakra-ui/react';

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const {data} = useSession()
  const reloadSession = ()=>{}
  console.log('here is the data',data)
  return (
    <Box>
      {data?.user?.username?(<Chat session={data}/>):(<Auth session={data} reloadSession={reloadSession}/>)}
    </Box>
  )
}

export async function getServerSideProps(ctx: NextPageContext) {
  const session = await getSession(ctx);

  return {
    props: {
      session,
    },
  };
}
