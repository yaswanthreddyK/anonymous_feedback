import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from 'bcryptjs'
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";


export async function POST (request: Request){
    await dbConnect()

    try {
        const {username, email, password} = await request.json()
        const existingUserVerifiedByUsername = await UserModel.findOne({username, isVerified: true})
        const verifyCode = Math.floor(Math.random()*900000+1).toString()
        if(existingUserVerifiedByUsername){
            return Response.json(
                {
                    success: false,
                    message: 'Username already taken.'
                },
                {
                    status: 400
                }
            )
        }

        const existingUserByEmail = await UserModel.findOne({email})
        if(existingUserByEmail){
            if(existingUserByEmail.isVerified){
                return Response.json({
                    success: false,
                    message: 'Email already exists.'
                }, {status: 400})
            }else{
                const hashedPassword = await bcrypt.hash(password, 10)
                existingUserByEmail.password = hashedPassword
                existingUserByEmail.verifyCode = verifyCode
                existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000)
                await existingUserByEmail.save()
            }
        }else{
            const hashedPassword = await bcrypt.hash(password, 10)
            const expiryDate = new Date()
            expiryDate.setHours(expiryDate.getHours() + 1)

           const newUser = new UserModel({
                username,
                email,
                password: hashedPassword,
                verifyCode,
                verifyCodeExpiry: expiryDate,
                isVerified: false,
                lastLogin: Date.now(),
                isAcceptingMessage: true,
                message: []
            })

            await newUser.save()
        }

        //send verification email
       const emailResponse = await sendVerificationEmail(email, username, verifyCode)
       if(!emailResponse.success){
        return Response.json({
            success: false,
            message: emailResponse.message
        },{
            status: 500
        })
       }
       
       return Response.json({
        success: true,
        message: 'User registered successfully. Please verify your email.'
    },{
        status: 201
    })
    } catch (error) {
        console.error('Error registering user', error)
        return Response.json(
            {
            success: false,
            message: 'Error registering user'
            },
            {
                status: 500
            }
    )
    }
}