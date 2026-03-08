import express from "express";
export const authRouter = express.Router();
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../../db.ts";
import { loginSchema, signupSchema } from "../validator/authScehma.ts";

authRouter.post("/signup" ,  async (req , res) =>{
const data = signupSchema.safeParse(req.body)
if(!data.success){
    return res.status(400).json({
        error : "Invalid Signup Inputs"
    })
}
const { name, email, password } = data.data;
const existingUser = await prisma.user.findUnique({
    where : {email : email }
})
 
if(existingUser){
    return res.status(400).json({
        error : "User already exists"
    })
}

const hashedPassword = await bcrypt.hash(password , 10);

const user = await prisma.user.create({
    data : {
        name : name,
        email : email,
        password : hashedPassword
    }
})

const token = jwt.sign({id : user.id} , process.env.JWT_SECRET! , {expiresIn : "1d"})

return res.status(200).json({
    message : "Signed up successfully",
    token : token
})
}) 

authRouter.post("/login" , async(req , res)=>{
    const data = loginSchema.safeParse(req.body)
    if(!data.success){
        return res.status(400).json({
            error : "Invalid Login Inputs"
        })
    }
    const { email, password } = data.data;
    const existingUser = await prisma.user.findUnique({
        where : {email : email }
    })
     
    if(!existingUser){
        return res.status(400).json({
            error : "User not found"
        })
    }
    
    const isPasswordValid = await bcrypt.compare(password , existingUser.password!);
    
    if(!isPasswordValid){
        return res.status(400).json({
            error : "Invalid Password"
        })
    }
    
    const token = jwt.sign({id : existingUser.id} , process.env.JWT_SECRET! , {expiresIn : "1d"})
    
    return res.status(200).json({
        message : "Logged in successfully",
        token : token
    })
})