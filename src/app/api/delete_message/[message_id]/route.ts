import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { getServerSession } from "next-auth";
import { User } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import mongoose from "mongoose";

export async function DELETE(request: Request, {params}: {params: {message_id: string}}){
    await dbConnect()
    const session = await getServerSession(authOptions)
    const user: User = session?.user
    const message_id = params?.message_id || request.url.split('delete_message/')[1]
    if(!session || !session.user){
        return Response.json(
            {
                success: false,
                message: 'Not authenticated'
            },
            { status: 401 }
        )
    }


    try {
        const messageId = new mongoose.Types.ObjectId(message_id)
        const updateMessages = await UserModel.updateOne({_id: user._id}, {$pull: {'messages': {_id: messageId}}})
        
        if(updateMessages.modifiedCount === 0){
            return Response.json(
                {
                    success: false,
                    message: 'Message not found or already deleted'
                },
                { status: 404 }
            )
        }

        return Response.json(
            {
                success: true,
                message: 'Message deleted'
            },
            { status: 200 }
        )
    } catch (error) {
        console.log('Unexpected error while deleting messages: ', error)
        return Response.json(
            {
                success: false,
                message: 'Unexpected Error.'
            },
            { status: 500 }
        )
    }
}