import UserModel from "@/model/User";
import dbConnect from "@/lib/dbConnect";
import {date, z} from 'zod'
import { usernameValidation } from "@/schemas/signupSchema";

export async function POST(request: Request){
    await dbConnect()

    try {
        const {username, code} = await request.json()
        const decodedUsername = decodeURIComponent(username)
        const user = await UserModel.findOne({username: decodedUsername})
        if(!user){
            return Response.json(
                {
                    success: false,
                    message: 'User not found'
                },
                { status: 400 }
            )
        }

        const isCodeValid = user.verifyCode === code
        const codeNotExpired = new Date(user.verifyCodeExpiry) > new Date()

        if(isCodeValid && codeNotExpired){
            user.isVerified = true
            await user.save()
            return Response.json(
                {
                    success: true,
                    message: 'User is Verified'
                },
                { status: 200 }
            )
        }else if(!codeNotExpired){ // if the code is expired
            return Response.json(
                {
                    success: false,
                    message: 'Code expired. Please signup again'
                },
                { status: 400 }
            )
        }else{
            return Response.json(
                {
                    success: false,
                    message: 'Incorrect Verification code'
                },
                { status: 400 }
            )
        }

    } catch (error) {
        console.log('Error verifying user: ',error)
        return Response.json(
            {
                success: false,
                message: 'Error verifying user'
            },
            { status: 500 }
        )
    }
}