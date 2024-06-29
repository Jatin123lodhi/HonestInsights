"use client";
import React, { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Form,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { messageSchema } from "@/schemas/messageSchema";
import { useParams } from "next/navigation";
import { z } from "zod";
import axios, { AxiosError } from "axios";
import { toast } from "@/components/ui/use-toast";
import messages from "../../../message.json";
import { ApiResponse } from "@/types/ApiResponse";
import { Separator } from "@/components/ui/separator";

const UserPublicProfilePage = () => {
  // hooks
  const params = useParams();
  const [isLoading, setIsLoading] = useState(false);

  // TODO:
  // there should be a check if there exists a correct username
  // if not redirect or show some error message

  const form = useForm({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      content: "",
    },
  });

  const messageContent = form.watch("content");

  type MessageSchema = z.infer<typeof messageSchema>;

  // functions
  const onSubmit = async (formData: MessageSchema) => {
    setIsLoading(true);
    try {
      const response = await axios.post(`/api/send-message`, {
        username: params?.username,
        content: formData.content,
      });
      console.log(response);
      if (response?.data?.success) {
        toast({
          title: "Success",
          description: response?.data?.message,
        });
        form.reset();
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Info",
        description:
          axiosError?.response?.data?.message || "Failed to send message",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className=" px-[8%] py-[2%] bg-slate-100">
      <div className="flex justify-center my-10 text-4xl font-bold">
        Public Profile Link
      </div>

      {/* form  */}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 mx-[16%] mt-4"
        >
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700 font-semibold text-lg">
                  Send Anonymous Message to @{params?.username}
                </FormLabel>
                <FormControl>
                  <Textarea
                    className="shadow-md text-lg"
                    placeholder="Write your anonymous message here"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-center">
            <Button
              className="shadow-md"
              disabled={!messageContent || isLoading}
              type="submit"
            >
              Send It
            </Button>
          </div>
          <Separator/>
          {/* suggestion part  */}
          <div>
            <div className="my-4 font-semibold text-lg">Click on any message below to select it.</div>
            <div className="p-8 rounded-md border shadow-md bg-white">
              <div className="my-2 flex justify-between items-center">
                <div className="text-xl font-semibold">Messages</div>
                <Button type="button">Suggest Messages</Button>
              </div>
              <div className="flex flex-col gap-4 mt-6">
                {messages.map((msg, idx) => (
                  <div
                    onClick={() => form.setValue("content", msg.content)}
                    key={idx}
                    className="p-2 rounded-md border text-center hover:bg-gray-200 cursor-pointer"
                  >
                    {msg.content}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default UserPublicProfilePage;
