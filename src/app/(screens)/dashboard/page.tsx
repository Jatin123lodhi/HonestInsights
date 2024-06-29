"use client";
import MessageCard from "@/components/MessageCard";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { Message } from "@/model/User";
import { acceptMessageSchema } from "@/schemas/acceptMessageSchema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { LoaderCircle, RefreshCcw } from "lucide-react";
import { useSession } from "next-auth/react";
import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

const Dashboard = () => {
  // states
  const [messages, setMessages] = useState<Message[]>([]);
  const [isMessagesLoading, setIsMessagesLoading] = useState(false);
  const [isSwitchStateLoading, setIsSwitchLoading] = useState(false);

  // hooks
  const { toast } = useToast();

  const { register, setValue, watch } = useForm({
    resolver: zodResolver(acceptMessageSchema),
    defaultValues: {
      acceptMessages: true,
    },
  });

  const acceptMessageState = watch('acceptMessages',true)
 

  const handleRefresh = () => {
    fetchMessages();
  };

 
  const fetchAcceptMessageState = useCallback(async () => {
    setIsSwitchLoading(true);
    try {
      const response = await axios.get<ApiResponse>("/api/accept-messages");
      const { data } = response;
      console.log(response,'  response of is acceptiong message')
      const { success, isAcceptingMessage } = data;
      if (success) {
        console.log(isAcceptingMessage,'  isAcceptingMessage after fetching');
        setValue("acceptMessages", Boolean(isAcceptingMessage));
      }else{
        console.log('something went wrong while fetching accept message state')
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      if (axiosError.response && axiosError.response.status === 400) {
        console.log(axiosError.response.data.message);
        toast({
          title: "Error",
          description:
            axiosError.response.data.message ||
            "Something went wrong fetching message settings",
            variant:'destructive'
        });
      }
    } finally {
      setIsMessagesLoading(false);
      setIsSwitchLoading(false);
    }
  }, [setValue,toast]); // TODO: research more on these dependencies

  const fetchMessages = useCallback(async(refresh: boolean=false)=>{
    setIsMessagesLoading(true)
    setIsSwitchLoading(true)
    try{
      const response = await axios.get<ApiResponse>('/api/get-messages')
      
      if(response.data.success){
        setMessages(response?.data?.messages || []) 
        if(refresh){
          toast({
            title:'Refreshed Messages',
            description: 'Showing latest messages'
          })
        }
      }
    }catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      if (axiosError.response && axiosError.response.status === 400) {
        console.log(axiosError.response.data.message);
        toast({
          title: "Error",
          description:
            axiosError.response.data.message ||
            "Something went wrong fetching messages",
            variant:'destructive'
        });
      }
    }finally{
      setIsMessagesLoading(false)
      setIsSwitchLoading(false)
    }
  },[])

  const { data: session, status } = useSession();

  useEffect(() => {
    if(!session || !session.user) return 
    fetchMessages();
    fetchAcceptMessageState()
  }, [fetchAcceptMessageState, fetchMessages, session]);


  if (!session || !session.user) return <div>Please login</div>;
  const username  = session.user.username
  const baseUrl = `${window.location.protocol}/${window.location.host}`
  const profileUrl = `${baseUrl}/u/${username}`

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl)
    toast({
      title: "URL Copied",
      description: profileUrl
    });
  };

  const handleSwitchChange = async()=>{
     try{
      // make an api call
      setIsSwitchLoading(true)
      
      const response = await axios.post(`/api/accept-messages`,{
        acceptMessages: !acceptMessageState
      })
      setValue('acceptMessages',!acceptMessageState)
      toast({
        title: "Success",
        description: response.data.message
      })
     }catch(error){
      console.log(error)
     }finally{
      setIsSwitchLoading(false)
     }
  }

  return (
    <>
      <div className="mx-[8%]">
        <div className="text-3xl mt-8">User Dashboard</div>

        <div className="text-lg mt-8">Copy your unique link</div>
        <div className="flex gap-4 mt-2">
          <input
            className="flex-1 rounded-md px-4 bg-[#e9ecef]"
            type="text"
            value={profileUrl}
            disabled
          />
          <Button onClick={handleCopyToClipboard}>Copy</Button>
        </div>

        <div className="flex items-center gap-4 my-8">
          <Switch 
           {...register("acceptMessages")}
           disabled={isSwitchStateLoading}
           checked={acceptMessageState}
           onCheckedChange={handleSwitchChange} 
           />
          <div>Accept Messages: {acceptMessageState ? 'On' : 'Off'}</div>
        </div>
        <Separator />

        {/* refresh button  */}
        <div className="mt-4">
          <Button onClick={handleRefresh}>
            {isMessagesLoading ? (
              <LoaderCircle className="animate-spin" />
            ) : (
              <RefreshCcw size={"22"} />
            )}
          </Button>
        </div>

        {/* list of message cards  */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          {messages.map((message,idx) => (
            <MessageCard key={idx} message={message} onDeleteSuccess={()=>fetchMessages()} />
          ))}
        
        </div>
      </div>
    </>
  );
};

export default Dashboard;
