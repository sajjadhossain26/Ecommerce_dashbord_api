import bcrypt from 'bcryptjs'
import Role from '../models/Role.js'
import createError from "./errorController.js"
import jwt from "jsonwebtoken"
import { createSlug } from '../helper/slug.js'

/**
 * @access public
 * @method GET
 * @route api/role
 */


export const getAllrole =async (req, res, next) => {
  try {
   const roles = await Role.find()
    if(roles.length > 0){
        res.status(200).json(roles)
    }

  } catch (error) {
    next(error)
  }
}

/**
 * @access public
 * @method GET
 * @route api/role:id
 */

export const getSinglerole =async (req, res, next) => {
  const {id} =await req.params


  try {
   const role = await Role.findById(id)
    
    if(!role){
      return res.status(404).json({
        message: "role data not found"
      })
    }
    if(role){
    res.status(200).json(role)
    }

  } catch (error) {
    next(error)
  }
}


/**
 * @access public
 * @method post
 * @route api/role
 */

export const createrole =async (req, res, next) => {
  const {name, permissions} =req.body;

  if(!name){
    return res.status(404).json({
        message: "role name is required!"
    })
  }

  const findUser = await Role.findOne({name})

  if(findUser){
   return res.status(400).json({
    message: "role Already exist",
    
   })
  }

  try {
   const role = await Role.create({name, slug: createSlug(name), permissions})
   res.status(200).json({
    message: "role Created Successfull!",
    role
   })
  } catch (error) {
    next(error)
  }
  }


/**
 * @access public
 * @method PUT/PATCH
 * @route api/role:id
 */

export const updaterole =async (req, res, next) => {
  const {id} = req.params
  const {name, permissions} = req.body

  if(!name){
  return res.status(404).json({
    message: "role name is required!"
   })
    
  }
   try {
   const role = await Role.findByIdAndUpdate(id, {name, permissions: permissions, slug: createSlug(name)}, {new: true})
   res.status(200).json({role, message: "Role updated successful"})
  } catch (error) {
   next(error)
  }
}


/**
 * @access public
 * @method delete
 * @route api/role:id
 */

export const deleterole =async (req, res, next) => {
  const {id} =await req.params
   try {
   const role = await Role.findByIdAndDelete(id)
   res.status(200).json(role)
  } catch (error) {
    next(error)
  }
}

