import bcrypt from 'bcryptjs'
import Permission from '../models/Permission.js'
import createError from "./errorController.js"
import jwt from "jsonwebtoken"
import { createSlug } from '../helper/slug.js'

/**
 * @access public
 * @method GET
 * @route api/permission
 */


export const getAllpermission =async (req, res, next) => {
  try {
   const permissions = await Permission.find()
    if(permissions.length == 0){
        return res.status(404).json({
            message: "Permission data not found"
        })
    }

    res.status(200).json(permissions)
  } catch (error) {
    next(error)
  }
}

/**
 * @access public
 * @method GET
 * @route api/permission:id
 */

export const getSinglepermission =async (req, res, next) => {
  const {id} =await req.params


  try {
   const permission = await Permission.findById(id)
    
    if(!permission){
      return res.status(404).json({
        message: "Permission data not found"
      })
    }
    if(permission){
    res.status(200).json(permission)
    }

  } catch (error) {
    next(error)
  }
}


/**
 * @access public
 * @method post
 * @route api/permission
 */

export const createpermission =async (req, res, next) => {
  const {name} =req.body;

  if(!name){
    return res.status(404).json({
        message: "Permission name is required!"
    })
  }

  const findUser = await Permission.findOne({name})

  if(findUser){
   return res.status(400).json({
    message: "Permission Already exist",
    
   })
  }


  try {
   const permission = await Permission.create({name, slug: createSlug(name)})
   res.status(200).json({
    message: "permission Created Successfull!",
    permission
   })
  } catch (error) {
    next(error)
  }
  }


/**
 * @access public
 * @method PUT/PATCH
 * @route api/permission:id
 */

export const updatepermission =async (req, res, next) => {
  const {id} = req.params
  const {name} = req.body

  if(!name){
  return res.status(404).json({
    message: "Permission name is required!"
   })
    
  }
   try {
   const permission = await Permission.findByIdAndUpdate(id, {name, slug: createSlug(name)}, {new: true})
   res.status(200).json(permission)
  } catch (error) {
   next(error)
  }
}


/**
 * @access public
 * @method delete
 * @route api/permission:id
 */

export const deletepermission =async (req, res, next) => {
  const {id} =await req.params
   try {
   const permission = await Permission.findByIdAndDelete(id)
   res.status(200).json({permission, message: "Permission data deleted"})
  } catch (error) {
    next(error)
  }
}



/**
 * @access public
 * @method put
 * @route api/permission/status:id
 */

export const statusPermissionUpdate =async (req, res, next) => {
  const {id} =await req.params
  const {status} = req.body;

   try {
   const permission = await Permission.findByIdAndUpdate(id, {
    status: !status,
   }, {new: true})

   const allPermission = await Permission.find()
   res.status(200).json({permission: allPermission, message: "Status Updated successful"})
  } catch (error) {
    next(error)
  }
}

