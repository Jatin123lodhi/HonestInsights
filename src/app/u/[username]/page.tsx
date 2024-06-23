"use client";
import React from "react";
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

const UserPublicProfilePage = () => {
  // hooks
  const params = useParams();

  const form = useForm({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      message: "",
    },
  });

  // functions
  const onSubmit = () => {
    console.log("on submit");
  };

  return (
    <div className=" mx-[8%] my-[2%]">
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
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Send Anonymous Message to @{params?.username}
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Write your anonymous message here"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-center">
            <Button disabled={form.getValues("message").length===0} type="submit">Send It</Button>
          </div>

          {/* suggestion part  */}
          <div>
            <Button>Suggest Messages</Button>
            <div className="my-4">Click on any message below to select it.</div>
            <div className="p-8 rounded-md border">
              <div className="text-xl my-2">Messages</div>
              <div className="flex flex-col gap-4 mt-4">
                <div className="p-2 rounded-md border text-center hover:bg-gray-200 cursor-pointer">{`What's your favourite movie`}</div>
                <div className="p-2 rounded-md border text-center hover:bg-gray-200 cursor-pointer">{`What's your favourite book`}</div>
                <div className="p-2 rounded-md border text-center hover:bg-gray-200 cursor-pointer">{`What's your favourite sports`}</div>
              </div>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default UserPublicProfilePage;
