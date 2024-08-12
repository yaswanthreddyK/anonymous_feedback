import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { getServerSession } from "next-auth";
import { User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import mongoose from "mongoose";

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

    const userId = new mongoose.Types.ObjectId(user._id);
    try {
        const userExists = await UserModel.findById(userId)
        if(!userExists){
            return Response.json(
                {
                    success: false,
                    message: 'User not found'
                },
                { status: 404 }
            )
        }
        const db_user = await UserModel.aggregate([
            { $match: {_id: userId} },
            { $unwind: '$messages'},
            { $sort: {'messages.createdAt': -1}},
            { $group: {_id: '$_id', messages: {$push: '$messages'}}}
        ])
    
        return Response.json(
            {
                success: true,
                messages: db_user[0]?.messages || []
            },
            { status: 200 }
        )
    } catch (error) {
        console.log('Unexpected error while getting messages: ', error)
        return Response.json(
            {
                success: false,
                message: 'Unexpected Error.'
            },
            { status: 500 }
        )
    }
}