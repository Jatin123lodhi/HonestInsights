import React from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { AlertDialogComp } from './AlertDialogComp'
import { Message } from '@/model/User'
import axios from 'axios'
import { useToast } from './ui/use-toast'

type MessageCardProps = {
  message: Message;
}

const MessageCard = ({message}: MessageCardProps) => {
  const {toast} = useToast();
  const handleDeleteConfirm = async()=>{
    const response = await axios.delete(`/api/delete-message/${message._id}`)
    toast({
      title: response.data.message
    })
  }
  return (
    <Card className='w-[620px]'>
      <div className='flex justify-between'>
      <CardHeader className=''>
        <CardTitle>{message?.content ?? "Some Message Title"}</CardTitle>
        <CardDescription>{message?.createdAt?.toLocaleString() ?? "2 hours ago"}</CardDescription>
      </CardHeader>
      <div className=' p-5'>
        <AlertDialogComp handleContinue={handleDeleteConfirm} onMessageDelete={()=>console.log('hihi')} />
      </div>
      </div>
    </Card>

  )
}

export default MessageCard