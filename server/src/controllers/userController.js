import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import generateToken from '../utils/generateToken.js';
import cookieOptions from '../utils/cookieOptions.js';
import generateRefreshToken from '../utils/generateRefreshToken.js';
import User from '../models/user.js';

export const register = async(req,res,next)=>{
    try{
      const {name,email,password,mobile}= req.body;
      const existingUser = await User.findOne({email});
      if(existingUser){
        return res.status(409).json({
            success: false,
            message: "Email already exits"
        })
      }
      const hashpassword = await bcrypt.hash(password,10);
      const newUser = await User.create({
        name,
        email,
        password: hashpassword,
        mobile
      });
      const accessToken = generateToken(newUser._id);
      const refreshToken = generateRefreshToken(newUser._id);
      const hasedRefreshToken = await bcrypt.hash(refreshToken,10);
      newUser.refreshToken = hasedRefreshToken;
      await newUser.save();
      res.cookie("refreshToken",refreshToken,cookieOptions);
      return res.status(201).json({
        success: true,
        message: "User register successfully",
        accessToken,
        user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        mobile: newUser.mobile,
      },
      });
    }
    catch(error){
      next(error);
    }
}

export const refreshAccessToken = async(req,res,next)=>{
  try {

    //read refresh token from cookie
    const refreshToken = req.cookies?.refreshToken;
    if(!refreshToken){
      return res.status(401).json({
        success: false,
        message: "Refresh token not found"
      });
    }
    //verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    //find user
    const existingUser = await User.findById(decoded.userId);
    //check if user exists and refresh token matches
    if(!existingUser || !(await bcrypt.compare(refreshToken, existingUser.refreshToken))){
      return res.status(401).json({
        success: false,
        message: "Invalid refresh token"
      });
    }
    //generate new access token
    const accessToken = generateToken(existingUser._id);
    //send new access token in response
    return res.status(200).json({
      success: true,
      accessToken,
    });
  }
  catch(error){
    next(error);
  }
}

export const login = async(req,res,next)=>{
  try{
   const {email,password}=req.body;
   const exisitingUser = await User.findOne({email});
   if(!exisitingUser){
    return res.status(400).json({
      success: false,
      message: "Invalide email or password"
    });
   }
   const passwordMatch = await bcrypt.compare(password,exisitingUser.password);
    if(!passwordMatch){
    return res.status(400).json({
      success: false,
      message: "Invalide email or password"
    });
   }
   const accessToken = generateToken(exisitingUser._id);
   const refreshToken = generateRefreshToken(exisitingUser._id);
   const hashedRefreshToken = await bcrypt.hash(refreshToken,10);
   exisitingUser.refreshToken = hashedRefreshToken;
   await exisitingUser.save();
   res.cookie("refreshToken",refreshToken,cookieOptions);
   return res.status(200).json({
    success: true,
    message: "Login Successfully",
    accessToken,
    user: {
        id: exisitingUser._id,
        name: exisitingUser.name,
        email: exisitingUser.email,
        mobile: exisitingUser.mobile,
    }
   })
  

  }
  catch(error){
    next(error)
  }
}

export const logout = async (req, res, next) => {
  try {
    // 1. Read refresh token from cookie
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: "Refresh token not found",
      });
    }

    // 2. Verify JWT
    let decoded;

    try {
      decoded = jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_SECRET
      );
    } catch (error) {
      res.clearCookie("refreshToken", cookieOptions);

      return res.status(401).json({
        success: false,
        message: "Invalid or expired refresh token",
      });
    }

    // 3. Find user
    const user = await User.findById(decoded.userId);

    if (!user) {
      res.clearCookie("refreshToken", cookieOptions);

      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // 4. Check if user is already logged out
    if (!user.refreshToken) {
      res.clearCookie("refreshToken", cookieOptions);

      return res.status(401).json({
        success: false,
        message: "User already logged out",
      });
    }

    // 5. Compare refresh token with hashed token
    const isMatch = await bcrypt.compare(
      refreshToken,
      user.refreshToken
    );

    if (!isMatch) {
      res.clearCookie("refreshToken", cookieOptions);

      return res.status(401).json({
        success: false,
        message: "Invalid refresh token",
      });
    }

    // 6. Remove refresh token from database
    user.refreshToken = null;
    await user.save();

    // 7. Clear cookie
    res.clearCookie("refreshToken", cookieOptions);

    // 8. Success response
    return res.status(200).json({
      success: true,
      message: "User logged out successfully",
    });

  } catch (error) {
    next(error);
  }
};
