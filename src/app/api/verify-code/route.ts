import dbConnect from "@/lib/dbConnect"
import UserModel from "@/model/User";
import { verifySchema } from "@/schemas/verifySchema";
import {z} from "zod"
 
const VerificationCodeSchema = verifySchema


export const POST = async(request:Request)=>{
    await dbConnect();
    try{
        const {username,code} = await request.json();
       
        const result = VerificationCodeSchema.safeParse({code})
        
        if(!result.success){
            const codeErrors = result.error.format().code?._errors || []
          
            return Response.json({
                success: false,
                message: codeErrors?.length > 0 ? codeErrors?.join(', '): "Invalid query parameters"
            },{
                status: 400
            })
        }

        // const encodedUsername = decodeURIComponent(username)  //particularly used when data is comming from url 
        const user = await UserModel.findOne({username})
        if(!user){
            return Response.json({
                success: false,
                message: "User not found"
            },{
                status: 400
            })
        }
        
        const isCodeValid = code === user.verifyCode;
        const isCodeExpired = new Date(user.verifyCodeExpiry)  < new Date()

        if(isCodeValid && !isCodeExpired){
            user.isVerified = true;
            await user.save();
            return Response.json({
                success: true,
                message: "User verified successfully"
            },{
                status: 200
            })
        }
        else if(!isCodeValid){
            return Response.json({
                success: false,
                message: "Invalid verification code"
            },{
                status: 400
            })
        }else if(isCodeExpired){
            return Response.json({
                success: false,
                message: "Verification code expired"
            },{
                status: 400
            })
        }

        return Response.json({
            success: false,
            message: "Something went wrong"
        },{
            status: 500
        })
    }catch(err){
        console.error(`Error checking verification code: ${err}`)
        return Response.json({
            success: false,
            message: "Error checking verification code"
        },{
            status: 500
        })
    }
}