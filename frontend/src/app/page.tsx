"use client";
import Auth from '@/components/Auth';
import Chat from '@/components/Chat';
import { Box } from '@chakra-ui/react';
import { Inter } from '@next/font/google';
import { NextPageContext } from 'next';
import { getSession, useSession } from 'next-auth/react';

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const {data:session} = useSession()
  const reloadSession = ()=>{
    const event = new Event('visibilitychange');
    document.dispatchEvent(event)
  }
  console.log('here is the data',session)
  
  return (
    <Box>
      {session?.user?.username?(<Chat session={session}/>):(<Auth session={session} reloadSession={reloadSession}/>)}
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
