import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { usernameValidation } from "@/schemas/signUpSchema";
import {z} from "zod"

const UsernameQuerySchema = z.object({
    username: usernameValidation
})

export const GET = async(request:Request)=>{
    await dbConnect();
    try{
        const {searchParams} = new URL(request.url)
        const queryParams = {
            username: searchParams.get("username")
        }
        const result = UsernameQuerySchema.safeParse(queryParams)
        // console.log(`result of safeParse: ${JSON.stringify(result)}`)
        if(!result.success){
            const usernameErrors = result.error.format().username?._errors || []
            return Response.json({
                success: false,
                message: usernameErrors?.length > 0 ? usernameErrors?.join(', '): "Invalid query parameters"
            },{
                status: 400
            })
        }
        const {username} = result.data
        const user = await UserModel.findOne({username})
        if(user){
            return Response.json({
                success: false,
                message: "Username is already taken"
            },{
                status: 400
            })
        }else{

            return Response.json({
                success: true,
                message: "Username is unique"
            },{
                status: 200
            })
        }
       
    }catch(err){
        console.error(`Error checking username: ${err}`)
        return Response.json({
            success: false,
            message: "Error checking username"
        },{
            status: 500
        })
    }
}