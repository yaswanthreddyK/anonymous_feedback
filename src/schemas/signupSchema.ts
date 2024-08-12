import {z} from 'zod'

export const usernameValidation = z
.string()
.min(2, 'Username must be atleast 2 Characters')
.max(15, 'Username must not be more than 15 Characters')
.regex(/^[A-Za-z0-9]+$/, 'Username must not contain special characters')


export const SignupSchema = z.object({
    username: usernameValidation,
    email: z.string().email({message: 'Invalid email address'}),
    password: z.string()
    .min(8, 'Password should have atleast 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d!@#$%^&*]+$/, 'Password must contain an uppercase letter, a lowercase letter, a number, and a special character (!@#$%^&*)'),

})