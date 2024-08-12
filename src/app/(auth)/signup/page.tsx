'use client'
import React, { useEffect, useState } from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import Link from 'next/link'
import { useDebounceValue, useDebounceCallback } from 'usehooks-ts'
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from 'next/navigation'
import { SignupSchema } from '@/schemas/signupSchema'
import axios, {AxiosError} from 'axios'
import { ApiResponse } from '@/types/ApiResponse'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'

const page = () => {
  const [username, setUsername] = useState('')
  const [usernameMessage, setUsernameMessage] = useState('')
  const [isCheckingUsername, setIsCheckingUsername] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const debounced = useDebounceCallback(setUsername, 500)
  const debounedIsChecking = useDebounceCallback(setIsCheckingUsername, 200)
  const { toast } = useToast()
  const router = useRouter()

  //Zod implementation
  const form = useForm({
    resolver: zodResolver(SignupSchema),
    defaultValues: {
      username: '',
      email: '',
      password: ''
    }
  })

  useEffect(() => {
    const checkUsernameUniqueness = async () => {
      if(username){
        console.log(username)
        setIsCheckingUsername(true)
        setUsernameMessage('')
        try {
         const response = await axios.get(`/api/check_username_uniqueness?username=${username}`)
         setUsernameMessage(response.data.message)
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>;
          setUsernameMessage(axiosError.response?.data.message ?? "Error checking username")
        }finally{
          debounedIsChecking(false)
        }
      }
    }
    checkUsernameUniqueness()
  },[username])

  const onSubmit = async (data: z.infer<typeof SignupSchema>) => {
    setIsSubmitting(true)
    try {
     const response = await axios.post<ApiResponse>('/api/signup', data)
      toast({
        title: 'Success',
        description: response.data.message
      })

      router.replace(`/verify/${username}`)
    } catch (error) {
      console.error("Error in signing up user: ",error)
      const axiosError = error as AxiosError<ApiResponse>;
      const errorMessage = axiosError.response?.data.message

      toast({
        title: 'Signup Failed!',
        description: errorMessage,
        variant: 'destructive'
      })
    }finally{
      setIsSubmitting(false)
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
             name="username"
             render={({field}) => (
               <FormItem>
                 <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="" 
                {...field} 
                onChange={(e) => {
                  field.onChange(e)
                  debounced(e.target.value)
                }}/>
                </FormControl>
                { isCheckingUsername ? <Loader2 className='animate-spin mt-1'/> :
                <p className={`text-sm ${usernameMessage === 'Username is unique' ? "text-green-500" : "text-red-500"}`}>
                { usernameMessage}
                </p>
             }
              <FormMessage/>
              </FormItem>
            )}
            />
            <FormField 
             control={form.control}
             name="email"
             render={({field}) => (
               <FormItem>
                 <FormLabel>Email</FormLabel>
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
                <Input type='password' placeholder="" 
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
                ) : ('Signup')
              }
             </Button>
          </form>
        </Form>
        <div className='text-center mt-4'>
          <p>
            Already a member? {' '}
            <Link href='/signin' className='text-blue-600 hover:text-blue-800'>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
    </>
  )
}

export default page