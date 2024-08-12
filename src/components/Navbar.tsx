'use client'
import { User } from 'next-auth'
import { signOut, useSession } from 'next-auth/react'
import React from 'react'
import { Button } from './ui/button'
import Link from 'next/link'

const Navbar = () => {
    const {data: session} = useSession()
    const user: User = session?.user
  return (
    <>
    <nav className='p-4 md:p-6 shadow-md  bg-black text-white'>
        <div className='container mx-auto flex flex-col md:flex-row justify-between items-center'>
            <a href='#' className='text-xl font-bold mb-4 md:mb-0'>Mystry Message</a>
            {
                session ? (
                    <>
                    <span className='mr-4'>Welcome, {user?.username}</span>
                    <Button className='w-full md:w-auto bg-white text-black' onClick={() => signOut()}>Logout</Button>
                    </>
                ) : ( <Link href='/signin'><Button className='w-full md:w-auto'>Login</Button></Link>)
            }
        </div>
    </nav>
    </>
  )
}

export default Navbar