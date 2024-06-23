"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useDebounceCallback, useDebounceValue } from "usehooks-ts";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { signUpSchema } from "@/schemas/signUpSchema";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  Form,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";
import axios, {  AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { signInSchema } from "@/schemas/signInSchema";
import { signIn } from "next-auth/react";

const Signin = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

   
  const { toast } = useToast();
  const router = useRouter();

  type SignInFormType = z.infer<typeof signInSchema>;

  //zod implementation
  const form = useForm<SignInFormType>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

 
  const onSubmit = async(formData: SignInFormType) => {
    try {
       setIsSubmitting(true)
       const response = await signIn('credentials', {
        redirect: false,
        identifier: formData.identifier,
        password: formData.password,
      }); 
      if(response?.error){
        toast({description: response?.error || "Incorrect  username or password"})
      }
    
       console.log(`Response : ${JSON.stringify(response)}`)
       if(response?.status===200){
        toast({description: "Signin Successfull!"})
        router.replace('/dashboard')
       }
    } catch (error) {
      console.error(`Error while submitting form ${JSON.stringify(error)}`);
      toast({description: 'Something went wrong'}); //TODO: error message 
    } finally {
      setIsSubmitting(false)
    }
    console.log(`${JSON.stringify(formData)}`);
  };

  return (
    <Form {...form}>
      <div  className=" flex justify-center p-4">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 shadow-md shadow-blue-300 rounded-md border flex flex-col p-8 w-[400px]">
          <FormField
            control={form.control}
            name="identifier"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Enter Email/Username</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="email/username"
                    
                  />
                </FormControl>
                
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button className="font-bold" type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <div className="flex gap-2">
                <span>Loading</span>
                <Loader className="animate-spin" />
              </div>
            ) : (
              "SigIn"
            )}
          </Button>
        </form>
      </div>  
    </Form>
  );
};

export default Signin;
