import {resend} from '@/lib/resend'
import { ApiResponse } from '@/types/ApiResponse'
import VerificationEmail from '../../emails/verificationEmail';
export async function sendVerificationEmail(
    email: string,
    username: string,
    verifyCode: string
) : Promise<ApiResponse> {
    
   try {
   const res = await resend.emails.send({
        from: 'onboarding@resend.dev',
        to:  'yaswanthreddy1729@gmail.com', //Email domain verification is needed.
        subject: 'Verification Email',
        react: VerificationEmail({username, otp: verifyCode})
      });
      
      if(res.error){
        console.log(res)
        return {
            success: false,
            message: 'Failed to send email.'
        }
      }
      
    return {
        success: true,
        message: 'Verification email sent'
    }
   } catch (emailError) {
    console.error('Error sending verification email', emailError)
    return {
        success: false,
        message: 'Failed to send verification email'
    }
   }
}
