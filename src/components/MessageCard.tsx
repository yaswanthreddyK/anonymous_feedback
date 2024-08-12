import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
  import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"
  import { Button } from "@/components/ui/button"

import React from 'react'
import { X } from "lucide-react"
import { Message } from "@/model/User"
import { useToast } from "./ui/use-toast"
import axios, { AxiosError } from "axios"
import { ApiResponse } from "@/types/ApiResponse"

type MessageCardProp = {
    message: Message,
    onMessageDelete: (messageId: string) => void
}

const formatDate = (date: Date) => {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  } 
  const formattedDate = new Date(date).toLocaleString('en-US',options)
  return formattedDate
}

const MessageCard = ({message, onMessageDelete}: MessageCardProp) => {
    const {toast} = useToast()

    const handleDeleteConfirm = async () => {
        try {
            onMessageDelete(`${message._id}`)
            const response = await axios.delete(`/api/delete_message/${message._id}`)
            toast({
                title: response.data.message || 'Message deleted'
            })
        } catch (error) {
          console.log(error)
            const axiosError = error as AxiosError<ApiResponse>
            const errorMessage = axiosError.response?.data.message
            toast({
                title: 'Failed to delete message',
                description: errorMessage
            })
        }
    }
  return (
    <Card className="h-max">
  <CardHeader>
    <AlertDialog>
      <div className="w-full flex justify-between gap-x-2">
        <div>
      <div className="">{message.content} </div>
      <div className="mt-2 text-slate-500 text-sm">{formatDate(message.createdAt)}</div>
        </div>
      <AlertDialogTrigger asChild>
        <Button variant="destructive"><X className="w-5 h-5"/></Button>
      </AlertDialogTrigger>
      </div>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the message.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDeleteConfirm}>Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </CardHeader>

  {/* <CardFooter>
    <p>Card Footer</p>
  </CardFooter> */}
</Card>

  )
}

export default MessageCard
