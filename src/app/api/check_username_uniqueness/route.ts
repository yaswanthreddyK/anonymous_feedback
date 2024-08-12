import UserModel from "@/model/User";
import dbConnect from "@/lib/dbConnect";
import {z} from 'zod'
import { usernameValidation } from "@/schemas/signupSchema";

const usernameQuerySchema = z.object({
    username: usernameValidation
})

export async function GET(request: Request){
    await dbConnect()
   try {
     const {searchParams} = new URL(request.url)
     const queryParams = {
         username: searchParams.get('username')
     }
     const result = usernameQuerySchema.safeParse(queryParams)
     if(!result.success){
        const usernameErrors = result.error.format().username?._errors || []
        return Response.json(
            {
                success: false,
                message: usernameErrors.length > 0 ? usernameErrors.join(',') : 'Invalid query parameters'
            },
            { status: 400 }
        )
     }
        
    const {username} = result.data
    const user = await  UserModel.findOne({username})
    if(user){
        return Response.json(
            {
                success: false,
                message: 'Username is already taken!'
            },
            { status: 400 }
        )
    }

    return  Response.json(
        {
            success: true,
            message: 'Username is unique'
        },
        { status: 200 }
    )
   } catch (error) {
    return Response.json(
        {
            success: false,
            message: 'Error checking username'
        },
        { status: 500 }
    )
   }
}