import bcrypt from 'bcryptjs'
import User from '../models/User.js'
import createError from "./errorController.js"
import jwt from "jsonwebtoken"

/**
 * @access public
 * @method GET
 * @route api/user
 */


export const getAllUser =async (req, res, next) => {
  try {
   const users = await User.find()
   console.log(req.me);
   res.status(200).json(users)
  } catch (error) {
    next(error)
  }
}

/**
 * @access public
 * @method GET
 * @route api/user:id
 */

export const getSingleUser =async (req, res, next) => {
  const {id} =await req.params


  try {
   const user = await User.findById(id)
    
    if(!user){
      return next(createError(404, "Single user not found"))
    }
    if(user){
    res.status(200).json(user)
    }

  } catch (error) {
    next(error)
  }
}


/**
 * @access public
 * @method post
 * @route api/user
 */

export const createUser =async (req, res, next) => {
  const {email} =req.body;

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
    user: user
   })
  } catch (error) {
    next(error)
  }
  }
}


/**
 * @access public
 * @method PUT/PATCH
 * @route api/user:id
 */

export const updateUser =async (req, res, next) => {
  const {id} =await req.params
   try {
   const user = await User.findByIdAndUpdate(id, req.body, {new:true})
   res.status(200).json(user)
  } catch (error) {
   next(error)
  }
}


/**
 * @access public
 * @method delete
 * @route api/user:id
 */

export const deleteUser =async (req, res, next) => {
  const {id} =await req.params
   try {
   const user = await User.findByIdAndDelete(id)
   res.status(200).json(user)
  } catch (error) {
    next(error)
  }
}

/**
 * @access public
 * @method post
 * @route api/user/login
 */

export const userLogin =async (req, res, next) => {
  try {
    // find user
    const user_login = await User.findOne({email: req.body.email})

    // check user exist or not
    if(!user_login){
        return next(createError(404, "User not found"))
    }
    // check password
    const user_password = await bcrypt.compare(req.body.password, user_login.password)
    if(!user_password){
        return next(createError(404, "password not matched"))
    }
    // create token
    const token = jwt.sign({id:user_login._id, isAdmin: user_login.isAdmin}, process.env.JWT_SECRET)

    // remove some data from user_login
    const {password, isAdmin, ...login_info } = user_login._doc
    res.cookie("access_token", token).status(200).json({
        token : token,
        user: login_info
    })
  } catch (error) {
    next(error)
  }
}



/**
 * @access public
 * @method post
 * @route api/user/register
 */

export const userRegister =async (req, res, next) => {
// bcrypt password
  const salt =await bcrypt.genSalt(10);
  const hash_pass =await bcrypt.hash(req.body.password, salt)

  try {
   const user = await User.create({...req.body, password: hash_pass})
   res.status(200).json(user)
  } catch (error) {
    next(error)
  }
}