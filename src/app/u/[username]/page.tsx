'use client'
import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { MessageSchema } from '@/schemas/messageSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { Textarea } from '@/components/ui/textarea'
import { useFormStatus } from 'react-dom'
import axios, { AxiosError } from 'axios'
import { toast } from '@/components/ui/use-toast'
import { ApiResponse } from '@/types/ApiResponse'
import { Loader2 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
 
const page = ({params}: {params: {username: string}}) => {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isFetchingSuggessions, setIsFetchingSuggessions] = useState(false)
    const [suggestedMessages, setSuggestedMessages] = useState(['What is your favourite food?', 'Do you have a dog?', 'Do you watch anime?'])
   const {username} = params
   const form = useForm<z.infer<typeof MessageSchema>>({
    resolver: zodResolver(MessageSchema)
   })
   const messageContent = form.watch('content')
    const onSubmit = async (data: z.infer<typeof MessageSchema>) => {
        setIsSubmitting(true)
        try {
          const response = await axios.post('/api/send_message',{
                username,
                content: data.content
            })
            toast({
                title: response.data.message
            })
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>
            toast({
                title: 'Message not sent',
                description: axiosError.response?.data.message
            })
        }finally{
            setIsSubmitting(false)
            form.setValue('content', '')
        }
    }

    const fetchSuggestionMessages = async () => {
      setIsFetchingSuggessions(true)
      try {
        const response = await axios.get('/api/suggest_messages')
        setSuggestedMessages(response.data.suggessions)
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>
        toast({
          description: axiosError.response?.data.message || 'Error fetching suggessions'
        })
      }finally{
        setIsFetchingSuggessions(false)
      }
    }

    const setMessageValue = (message: string) => {
      form.setValue('content', message)
    }
  return (
   <>
    <div className='max-w-4xl container mx-auto my-14'>
        
            <h1 className='text-4xl font-bold text-center mb-6'>
            Public Profile Link
            </h1>
            <div className=''>
            <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Send Anonymous Message to @{username}</FormLabel>
              <FormControl>
                <Textarea placeholder="Write your anonymous message here" className='resize-none' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className='flex justify-center'>
        <Button type="submit" className='' disabled={isSubmitting}>
            {
                isSubmitting ? ( <>
                    <Loader2 className='mr-2 h-4 w-4 animate-spin'/> Please Wait
                    </>) : ('Submit')
            }
        </Button>
        </div>
      </form>
    </Form>  
            </div>
            <div className='mt-10'>
                <Button onClick={(e) => fetchSuggestionMessages()} disabled={isFetchingSuggessions}>Suggest messages</Button>
                <div className='mt-4'>click on the messages to select it.</div>
                <Card className='pt-5 mt-6 min-h-60'>
                  <CardContent>
                  <h2 className='text-xl font-semibold '>Messages</h2>
                  {
                    isFetchingSuggessions ? (<div className='flex w-full h-40 justify-center items-center'>
                      <Loader2 className='animate-spin w-7 h-7'/>
                    </div>) : 
                     suggestedMessages.map((message, index) => {
                      return <Button variant='outline' key={index} onClick={(e) => setMessageValue(message)} className='block my-3 w-full text-wrap h-max'>{message}</Button>
                    })
                  }
                  
                 
                  </CardContent>
                  </Card>
            </div>
    </div>
   </>
  )
}

export default page