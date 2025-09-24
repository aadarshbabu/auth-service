import { comparePassword, hashPassword } from "../../utils/bcrypt.js";
import { ZodErrorParser } from "../../utils/zodError.js";
import { userModal } from "./modal.js";
import { loginSchema } from "./schema/loginSchema.js";
import { registerSchema } from "./schema/registerSchema.js";
import * as z from 'zod'
import jwt from 'jsonwebtoken'


export const userRegistration = async(req, res) =>{

    try {
        const payload = req.body;
        const validate = registerSchema.parse(payload);
        const userId = (Math.random() * 1000).toString();
        const passwordHash = await hashPassword(validate.password)

        await userModal.create({...validate, user_id: userId, password: passwordHash})
        res.status(201).json({
            message:"User register successful"
        })
        
        
    } catch (error) {
          if(error instanceof z.ZodError){
            const errors = ZodErrorParser(error.issues)
            console.log(errors)
            res.status(400).json(errors)
          }
          res.status(500).json({error: error.message})
    }



}

export const login = async(payload)=>{

    try {
        const {user_email, password} = payload || {}
       const auth =  loginSchema.parse({
            user_email,
            password
        })
        const userDetails = await userModal.findOne({user_email: auth.user_email})
        if(!userDetails){
            return {
                status: 400,
                message: "Invalid email or password"
            }
        }
        if(userDetails.is_blocked){
            return {
                status: 403,
                message: "User is blocked please contect admin."
            }
        }
        if(!userDetails.is_verified){
            return {
                status: 403,
                message: "Account is not verified please verify your account."
            }
        }
        if(userDetails.is_deleted){
            return {
                 status: 403,
                 message: "Your account is delete please activate your account."
            }
        }

        const isVerified = await comparePassword(auth.password, userDetails.password)
        if(!isVerified){
            return {
                status: 400,
                message: "Invalid  password"
            }
        }
        const token = jwt.sign({user_email: userDetails.user_email}, 'lfkajsdlfkasdfe12344');

        return {
            status: 200,
            data: {
                message: "User login success", 
                token: token
            }
        }
    } catch (error) {
        return {
            status: 500,
            message: error.message
        }
    }



}