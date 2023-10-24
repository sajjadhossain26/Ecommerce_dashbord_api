import asyncHandler from "express-async-handler";
import User from "../models/User.js";
import createError from "./errorController.js";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken'
import { mathRandom } from "../utilities/math.js";
import { sendResetCode } from "../utilities/sendMail.js";


/**
 * @access public
 * @method post
 * @route api/auth/register
 */


export const register = asyncHandler(async (req, res, next) => {
    const {name,email, password} =req.body;

    if(!name || !email || !password){
        next(createError(404, 'All Fields are required!'))
    }
  
    const findUser = await User.findOne({email})
  
    if(findUser){
     return next(createError(404, "Email already exist"))
    }else{
      // bcrypt password
    const salt =await bcrypt.genSalt(10);
    const hash_pass =await bcrypt.hash(req.body.password, salt)
  
    try {
     const user = await User.create({...req.body, password: hash_pass})
     res.status(200).json({
      message: "User Created Successfull!",
      user: user,
     })
    } catch (error) {
      next(error)
    }
    }
  })
  


/**
 * @access public
 * @method post
 * @route api/auth/login
 */

export const login = asyncHandler(async (req, res, next) => {
    const {email, password} =req.body;

    if(!email| !password){
        return res.status(404).json({
            message: "All Fields are required"
           })
    }
  
    const findUser = await User.findOne({email})
  
    if(!findUser){
        return res.status(404).json({
            message: "User not found"
           })
    }

    if(findUser){
        const checkpass = await bcrypt.compare(password, findUser.password)
        if(!checkpass){
           return res.status(404).json({
            message: "Wrong Password"
           })
        }
        if(checkpass){

           //Create access token
           const token = jwt.sign({email: findUser.email}, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRE_IN 
           });


            //Create refress token
            const refreshToken = jwt.sign({email: findUser.email}, process.env.REFRESH_TOKEN_SECRET, {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRE_IN 
            });
           
           res.cookie('access_token', token,{
            httpOnly: true,
            secure: process.env.APP_ENV == "Development"? false : true,
             sameSite: "strict",
             path: '/',
             maxAge: 7* 24* 60* 1000
           })
           res.status(200).json({
            message: 'Login successfull!',
            user: findUser,
            token: token,
            refreshToken: refreshToken
           })
        }
    }
  })
  


  /**
 * @access public
 * @method post
 * @route api/auth/logout
 */

  export const logout = asyncHandler(async(req, res, next) => {
    res.clearCookie("access_token");
    res.status(200).json({
        message: "Logout Successful"
    })
  })



/**
 * @access public
 * @method post
 * @route api/auth/loggedInUser
 */

export const loggedInUser = asyncHandler(async(req, res) => {
  res.status(200).json(req.me)
})



/**
 * @access public
 * @method post
 * @route api/auth/finduserReset
 */

export const findUserReset = asyncHandler(async(req, res, next) => {
try {
  const {email} = req.body;

  const resetUserFind = await User.findOne({email})

  if(!resetUserFind){
    return res.status(404).json({
      message: "User not found!"
    })
  }

if(resetUserFind){
   //  forgot password code
      let confirmCodeRest = mathRandom(10000, 99999)
// check code
       const checkCode = await User.findOne({code: confirmCodeRest})

if(checkCode){
  confirmCodeRest = mathRandom(10000, 99999)
}


    sendResetCode(resetUserFind.email, {
      name: resetUserFind.name,
      code: confirmCodeRest
    })
     
    await User.findByIdAndUpdate(resetUserFind._id, {
      code: confirmCodeRest
    })

      //Create access token
      const token = jwt.sign({email: resetUserFind.email}, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRE_IN 
       });

    

    res.cookie('findUser', token,{
      httpOnly: true,
      secure: process.env.APP_ENV == "Development"? false : true,
       sameSite: "strict",
       path: '/',
       maxAge: 7* 24* 60* 1000
     })

    return res.status(200).json({
      message: "Verification code has been send"
    })
  }
} catch (error) {
  next(error) 
}
})



/**
 * @access public
 * @method post
 * @route api/auth/codeConfirmationReset
 */

export const codeConfirmationReset = asyncHandler(async(req, res, next) => {
   try {

    const {code} = req.body


   const codematch = await User.findOne({code})

   if(!codematch){
   return  res.status(400).json({
      message: "Code not match"
     })
   }

   if(codematch){
    return res.status(200).json({
      message: "Set new passsword",
    })
   }

    
   } catch (error) {
    next(error)
   }
})



/**
 * @access public
 * @method post
 * @route api/auth/setNewPassword
 */

export const setNewPassword = asyncHandler(async(req, res, next) => {
  try {
    const accessToken = req.cookies.findUser;
    
   if(!accessToken){
    return res.status(400).json({
      message: "Unauthorized User"
  })
   }
    const tokenCheck = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET)

    
    if(!tokenCheck){
      return res.status(400).json({
          message: "Unauthorized User"
      })
     }
    if(tokenCheck){
      const resetUser = await User.findOne({email: tokenCheck.email})

        // bcrypt password
        const salt =await bcrypt.genSalt(10);
        const hash_pass =await bcrypt.hash(req.body.password, salt)
      if(resetUser){
        await User.findByIdAndUpdate({_id: resetUser._id}, {
          password: hash_pass,
          code: ""
        })

        return res.clearCookie("findUser").status(200).json({
          message: "Password reset sucessfull"
      })
      }
    }
   
  } catch (error) {
   next(error)
  }
})


