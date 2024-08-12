'use client'
import React, { useEffect, useState } from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { SubmitHandler, useForm } from "react-hook-form"
import * as z from "zod"
import Link from 'next/link'
import { useDebounceValue, useDebounceCallback } from 'usehooks-ts'
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from 'next/navigation'
import { SignupSchema } from '@/schemas/signupSchema'
import axios, {AxiosError} from 'axios'
import { ApiResponse } from '@/types/ApiResponse'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { SigninSchema } from '@/schemas/signinSchema'
import { signIn } from 'next-auth/react'

const Signin = () => {

  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  //Zod implementation
  const form = useForm({
    resolver: zodResolver(SigninSchema),
    defaultValues: {
      identifier: '',
      password: ''
    }
  })


  const onSubmit = async (data: z.infer<typeof SigninSchema>) => {
    setIsSubmitting(true)
    const result = await signIn('credentials', {
      redirect: false,
      identifier: data.identifier,
      password: data.password
    })
    if(result?.error){
      if(result?.error == 'CredentialsSignin'){
        toast({
          title: 'Login failed',
          description: 'Incorrect email or password',
          variant: 'destructive'
        })
      }else{
        toast({
          title: 'Login failed',
          description: result.error,
          variant: 'destructive'
        })
      }
      setIsSubmitting(false)
    }

    if(result?.url){
      setIsSubmitting(false)
      router.replace('/dashboard')
    }
  }
  return (
    <>
    <div className='flex justify-center items-center min-h-screen bg-gray-100'>
      <div className='w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md'>
        <div className='text-center'>
          <h1 className='text-4xl font-extrabold tracking-tight lg:text-5xl mb-6'>Join Mystery Message</h1>
          <p className='mb-4'>Sign up to start your anonymous adventure</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
            <FormField 
             control={form.control}
             name="identifier"
             render={({field}) => (
               <FormItem>
                 <FormLabel>Username / Email</FormLabel>
              <FormControl>
                <Input placeholder="" 
                {...field} 
               />
                </FormControl>
            
              <FormMessage/>
              </FormItem>
            )}
            />
            <FormField 
             control={form.control}
             name="password"
             render={({field}) => (
               <FormItem>
                 <FormLabel>Password</FormLabel>
              <FormControl>
                <Input placeholder="" 
                type='password'
                {...field} 
               />
              </FormControl>
              <FormMessage/>
              </FormItem>
            )}
            />
         
             <Button type="submit" disabled={isSubmitting}>
              {
                isSubmitting ? (
                  <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin'/> Please Wait
                  </>
                ) : ('Signin')
              }
             </Button>
          </form>
        </Form>
        <div className='text-center mt-4'>
          <p>
            Don&apos;t have an account? &nbsp;&nbsp;
            <Link href='/signup' className='text-blue-600 hover:text-blue-800'>Sign up</Link>
          </p>
        </div>
      </div>
    </div>
    </>
  )
}

export default Signin