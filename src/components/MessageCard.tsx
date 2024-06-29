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
import axios, { AxiosError } from 'axios'
import { useToast } from './ui/use-toast'
import { ApiResponse } from '@/types/ApiResponse'
import dayjs from 'dayjs';

type MessageCardProps = {
  message: Message;
  onDeleteSuccess: ()=>void
}

const MessageCard = ({message,onDeleteSuccess}: MessageCardProps) => {
  const {toast} = useToast();
  const handleDeleteConfirm = async()=>{
    try{

      const response = await axios.delete(`/api/delete-message/${message._id}`)
      toast({
        title: response.data.message
      })
      onDeleteSuccess();
    }catch(error){
      console.log(error)
      const axiosError = error as AxiosError<ApiResponse>;
      if (axiosError.response ) {
         toast({
          title: 'Error',
          description: axiosError.response.data.message
         })
      }  
    } 
  }
  return (
    <Card className='max-w-[620px]'>
      <div className='flex justify-between'>
      <CardHeader className=''>
        <CardTitle>{message?.content ?? "Some Message Title"}</CardTitle>
        <CardDescription className='pt-2'>{dayjs(message.createdAt).format('MMM D, YYYY h:mm A')}</CardDescription>
      </CardHeader>
      <div className=' p-5'>
        <AlertDialogComp handleContinue={handleDeleteConfirm} />
      </div>
      </div>
    </Card>

  )
}

export default MessageCard