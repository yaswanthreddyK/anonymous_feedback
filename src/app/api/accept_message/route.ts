import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { getServerSession } from "next-auth";
import { User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";

export async function POST(request: Request){
    await dbConnect()

    const session = await getServerSession(authOptions)
    const user: User = session?.user

    if(!session || !session.user){
        return Response.json(
            {
                success: false,
                message: 'Not authenticated'
            },
            { status: 401 }
        )
    }

    const userId = user._id;
    const { acceptMessages } = await request.json()

    try {
        const updatedUser = await UserModel.findByIdAndUpdate({_id: userId}, {isAcceptingMessage: acceptMessages}, {new: true})
        if(!updatedUser){
            return Response.json(
                {
                    success: false,
                    message: 'Failed to update user'
                },
                { status: 400 }
            )
        }

        return Response.json(
            {
                success: true,
                message: 'Messages accepting status updated',
                updatedUser
            },
            { status: 200 }
        )

    } catch (error) {
        console.log('Failed to update user accept messages: ', error)
        return Response.json(
            {
                success: false,
                message: 'Failed to update user accept messages'
            },
            { status: 500 }
        )
    }
}


export async function GET(request: Request){
    await dbConnect()

    const session = await getServerSession(authOptions)
    const user: User = session?.user

    if(!session || !session.user){
        return Response.json(
            {
                success: false,
                message: 'Not authenticated'
            },
            { status: 401 }
        )
    }

    const userId = user._id
   try {
     const db_userDetails = await UserModel.findById(userId)
     if(!db_userDetails){
        return Response.json(
            {
                success: false,
                message: 'User not found'
            },
            { status: 400 }
        )
     }
    
     return Response.json(
        {
            success: true,
            message: 'Message settings Updated',
            isAcceptingMessages: db_userDetails.isAcceptingMessage 
        },
        { status: 200 }
    )
   } catch (error) {
    return Response.json(
        {
            success: false,
            message: 'Error getting messages acceptance status',
        },
        { status: 500 }
    )
   }
    
}