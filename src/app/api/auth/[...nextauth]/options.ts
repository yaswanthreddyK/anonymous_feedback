import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from 'bcryptjs'
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text"},
                password: { label: "Password", type: "password" }
              },
              async authorize(credentials: any): Promise<any>{
                await dbConnect()
                
                try {
                    const user = await UserModel.findOne({$or: [{email: credentials.identifier}, {username: credentials.identifier}]})
                    if(!user){
                        throw new Error("User doesn't exist")
                    }

                    if(!user.isVerified){
                        throw new Error("Please verify your account before login")
                    }

                    const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password)
                    if(!isPasswordCorrect){
                        throw new Error('Incorrect password')
                    }else{
                        return user
                    }

                } catch (error: any) {
                    throw new Error(error)
                }
              }
        })
    ],
    callbacks: {
        async session({ session, token }) {
            if(token){
               session.user._id = token._id
               session.user.isVerified = token.isVerified
               session.user.isAcceptingMessage = token.isAcceptingMessage
               session.user.username = token.username
            }
            return session
          },
          async jwt({ token, user }) {
            if(user){
                token._id = user._id?.toString()
                token.isVerified = user.isVerified
                token.isAcceptingMessage = user.isAcceptingMessage
                token.username = user.username
            }
            return token
          }
    },
    pages: {
        signIn: '/signin',
    },
    session: {
        strategy: 'jwt'
    },
    secret: process.env.NEXTAUTH_SECRET,
}