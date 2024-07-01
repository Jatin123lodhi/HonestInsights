import dbConnect from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { User } from "next-auth";
import UserModel from "@/model/User";
import { authOptions } from "../../auth/[...nextauth]/options";

export const DELETE = async (
  request: Request,
  { params }: { params: { messageId: string } }
) => {
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
  try {
    const userFound = await UserModel.findOne({email:user.email});
    const messages = userFound?.messages;
    const msgIdx = messages?.findIndex((msg) => msg?._id?.toString() == params.messageId);

    if (msgIdx===undefined || msgIdx===-1 ){
      return Response.json(
        { success: false, message: "Message not found" },
        { status: 404 }
      );
    }
    
    messages?.splice(msgIdx, 1);
    await userFound?.save();

    return Response.json(
      {
        success: true,
        message: "Message deleted successfully!",
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return Response.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
};
