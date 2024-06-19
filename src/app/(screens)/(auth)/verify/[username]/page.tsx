"use client"
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { verifySchema } from '@/schemas/verifySchema';
import { ApiResponse } from '@/types/ApiResponse';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { useParams, useRouter } from 'next/navigation'
import React from 'react'
import { useForm } from 'react-hook-form';
import {z} from "zod"

const VerifyAccount = () => {
  const router = useRouter();
  const param = useParams<{username:string}>();
  console.log(param)
  const username = param.username
  const {toast}  = useToast();

  type VerifySchemaType = z.infer<typeof verifySchema>
  const form = useForm<VerifySchemaType>({
    resolver: zodResolver(verifySchema),
    defaultValues:{
        code: ""
    }
  })

  const onSubmit = async(formData:VerifySchemaType)=>{
    try{
      const response = await axios.post('/api/verify-code',{username,...formData})
      console.log(`response verifycode :  ${JSON.stringify(response)}`)
      if(response.status===200){
        toast({description: response.data.message,variant:'default'})
        router.replace('/sign-in')
      }
    }catch(error){
      console.error(`Error while submitting form ${JSON.stringify(error)}`);
      const axiosError = error as AxiosError<ApiResponse>;
      if (axiosError.response) {
        toast({description:axiosError.response.data.message || 'Something went wrong',variant:"destructive"});
      }  
    }
 
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Enter code</FormLabel>
              <FormControl>
                <Input placeholder="code" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}

export default VerifyAccount