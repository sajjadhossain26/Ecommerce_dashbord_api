import bcrypt from "bcryptjs";
import asyncHandler from "express-async-handler";

import Tag from "../models/Tag.js";
import createError from "./errorController.js";
import jwt from "jsonwebtoken";
import { createSlug } from "../helper/slug.js";
import expressAsyncHandler from "express-async-handler";

/**
 * @access public
 * @method GET
 * @route api/tag
 */

export const getAlltag = asyncHandler(async (req, res, next) => {
  try {
    const tags = await Tag.find();

    if (!tags) {
      return res.status(404).json({
        message: "Tag data not found",
      });
    }
    if (tags.length > 0) {
      res.status(200).json(tags);
    }
  } catch (error) {
    next(error);
  }
});

/**
 * @access public
 * @method GET
 * @route api/tag:id
 */

export const getSingletag = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  try {
    const tag = await Tag.findById(id);

    if (!tag) {
      return res.status(404).json({
        message: "tag data not found",
      });
    }
    if (tag) {
      res.status(200).json(tag);
    }
  } catch (error) {
    next(error);
  }
});

/**
 * @access public
 * @method post
 * @route api/tag
 */

export const createtag = async (req, res, next) => {
  const { name } = req.body;
  console.log(name);

  if (!name) {
    return res.status(404).json({
      message: "tag name is required!",
    });
  }

  const findUser = await Tag.findOne({ name });

  if (findUser) {
    return res.status(400).json({
      message: "tag Already exist",
    });
  }

  try {
    const tag = await Tag.create({
      name,
      slug: createSlug(name),
    });
    res.status(200).json({
      message: "tag Created Successfull!",
      tag,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @access public
 * @method PUT/PATCH
 * @route api/tag:id
 */

export const updatetag = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { name } = req.body;

  if (!name) {
    return res.status(404).json({
      message: "tag name is required!",
    });
  }
  try {
    const tag = await Tag.findByIdAndUpdate(
      id,
      { name, slug: createSlug(name) },
      { new: true }
    );
    res.status(200).json({ tag, message: "Tag updated successful" });
  } catch (error) {
    next(error);
  }
});

/**
 * @access public
 * @method delete
 * @route api/tag:id
 */

export const deletetag = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  try {
    const tag = await Tag.findByIdAndDelete(id);
    res.status(200).json(tag);
  } catch (error) {
    next(error);
  }
});
