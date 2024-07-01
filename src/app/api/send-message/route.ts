import dbConnect from "@/lib/dbConnect"
import { Message } from "@/model/User";
import UserModel from "@/model/User";
//anyone can send message wheater they are logged in or not
export const POST = async(request:Request)=>{
    await dbConnect();
    const {username, content} = await request.json()
    try{
       const user = await UserModel.findOne({$or: [{ username }, { email: decodeURIComponent(username) }]})
       if(!user){
        return Response.json({
            success: false,
            message: "User not found"
        }, {status: 404})
       }
       // is user accepting the messages
       if(!user.isAcceptingMessage){
        return Response.json({
            success: false,
            message: "User is not accepting the message"
        },{status: 403})
       }

       const newMessage = {
        content,
        createdAt: new Date()
       }
       user.messages.push(newMessage as Message)
       await user.save();
       return Response.json({
        success: true,
        message: "Message sent successfully"
       })
    }catch(error){
        console.error(`Something went  wrong: ${error}`)
        return Response.json({
            success: false,
            message: "Something went wrong"
        },{status:500})
    }
}