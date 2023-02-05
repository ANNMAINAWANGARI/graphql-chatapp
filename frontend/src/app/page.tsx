"use client";
import Image from 'next/image'
import { Inter } from '@next/font/google'
import {signIn, signOut, useSession} from 'next-auth/react'
import {theme} from '../chakra/theme'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const {data} = useSession()
  console.log('here is the data',data)
  return (
    <main>
      
      <div>Home</div>
      <button onClick={()=>signIn('google')}>Sign In</button>
      <p>{data?.user?.name}</p>
      <button onClick={()=>signOut()}>Sign Out</button>
    </main>
  )
}
