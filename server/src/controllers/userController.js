import bcrypt from 'bcryptjs';
import generateToken from '../utils/generateToken.js'
import user from '../models/user.js';

export const register = async(req,res,next)=>{
    try{
      const {name,email,password,mobile}= req.body;
      const existingUser = await user.findOne({email});
      if(existingUser){
        return res.status(409).json({
            success: false,
            message: "Email already exits"
        })
      }
      const hashpassword = await bcrypt.hash(password,10);
      const newUser = await user.create({
        name,
        email,
        password: hashpassword,
        mobile
      });
      const token = generateToken(newUser._id);
      newUser.password = undefined;
      return res.status(201).json({
        success: true,
        message: "User register successfully",
        token,
        user: newUser
      })
    }
    catch(error){
      next(error);
    }
}

