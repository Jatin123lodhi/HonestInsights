import dbConnect from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import UserModel from "@/model/User";

// route will handle the toggle functionality - on/off
export const POST = async (request: Request) => {
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

  const userId = user._id;
  const { acceptMessages } = await request.json();
  try {
    const updatedUser = await UserModel.findOneAndUpdate(
      {email:user.email},
      { isAcceptingMessage: acceptMessages },
      { new: true }
    );
    if (!updatedUser) {
      return Response.json(
        {
          success: false,
          message: "Failed to update status or user not found",
        },
        { status: 401 }
      );
    }
    return Response.json(
      {
        success: true,
        message: "Message acceptance status updated successfully",
        updatedUser,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(`Error occured in toggle functionality :  ${error}`);
    return Response.json(
      {
        success: false,
        message:
          "Something went wrong, failed to update the status to accept messages",
      },
      { status: 500 }
    );
  }
};

// route to get status of accepting message
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

  const email = user.email;
  try {
    const user = await UserModel.findOne({email});
    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }
    return Response.json(
        {
          success: true,
          isAcceptingMessage : user.isAcceptingMessage,
          message: "Successfully got the status of message acceptance",
        },
        { status: 200 }
      );
  } catch (error) {
    console.error(
      `Error occured while gettting status of accept message :  ${error}`
    );
    return Response.json(
      {
        success: false,
        message:
          "Something went wrong, failed to get status of message acceptance",
      },
      { status: 500 }
    );
  }
};
