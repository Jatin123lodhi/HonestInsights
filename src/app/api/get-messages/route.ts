import dbConnect from "@/lib/dbConnect";
import { getServerSession, User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import mongoose from "mongoose";
import UserModel from "@/model/User";

export const GET = async (request: Request) => {
  await dbConnect();

  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;
  if (!session || !user) {
    return Response.json(
      {
        success: false,
        message: "Not Authenticated",
      },
      { status: 401 }
    );
  }

  const email = user.email
  try {
    const user = await UserModel.aggregate([
      {
        $match: {
          email: email
        },
      },
      {
        $unwind: "$messages",
      },
      {
        $sort: {
          "messages.createdAt": -1,
        },
      },
      {
        $group: {
          _id: "$email",
          messages: {
            $push: "$messages",
          },
        },
      },
    ]);
    if (!user || user.length === 0) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 401 }
      );
    }
    return Response.json(
      {
        success: true,
        message: "Not Authenticated",
        messages: user[0].messages
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(`Something went wrong : ${error}`)
    return Response.json(
        {
          success: false,
          message: "Something went wrong",
        },
        { status: 500 }
      );
  }
};
