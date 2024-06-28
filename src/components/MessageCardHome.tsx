import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Message } from "@/model/User";

type MessageCardHomeProps = {
  message: Message;
};

const MessageCardHome = ({ message }: MessageCardHomeProps) => {
  return (
    <Card className="w-[620px]">
      <CardHeader className="">
        <CardTitle>{message?.content ?? "Some Message Title"}</CardTitle>
        <CardDescription>
          {message?.createdAt?.toLocaleString() ?? "2 hours ago"}
        </CardDescription>
      </CardHeader>
    </Card>
  );
};

export default MessageCardHome;
