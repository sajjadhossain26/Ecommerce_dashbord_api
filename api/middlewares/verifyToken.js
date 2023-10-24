import jwt from 'jsonwebtoken'
import asyncHandler from 'express-async-handler'
import User from '../models/User.js'


const tokenVerify = (req, res, next) => {
   // const authHeader = req.headers.authorization || req.headers.Authorization

  const accessToken = req.cookies.access_token;

   if(!accessToken){
    return res.status(400).json({
        message: "Unauthorized User"
    })
   }

   jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, asyncHandler(async(err, decode) => {
      if(err){
        return res.status(400).json({message: "Invalid token"})
      }
      const me = await User.findOne({email: decode.email}).select("-password")

      req.me = me;
      next()
   }))

}

export default tokenVerify;