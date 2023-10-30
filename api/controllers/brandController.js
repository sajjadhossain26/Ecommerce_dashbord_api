import asyncHandler from "express-async-handler";
import Brand from "../models/Brand.js";
import { createSlug } from "../helper/slug.js";
import cloudinary from "cloudinary";
import fs from "fs";

cloudinary.v2.config({
  cloud_name: "dqnsevmgx",
  api_key: "243622522214831",
  api_secret: "lHtNOQ2vd4ZcekRu1aQ5K8SvSOg",
});

/**
 * @access public
 * @method GET
 * @route api/brand
 */

export const getAllbrand = asyncHandler(async (req, res, next) => {
  try {
    const brands = await Brand.find();

    if (!brands) {
      return res.status(404).json({
        message: "brand data not found",
      });
    }
    if (brands.length > 0) {
      res.status(200).json(brands);
    }
  } catch (error) {
    next(error);
  }
});

/**
 * @access public
 * @method GET
 * @route api/brand:id
 */

export const getSinglebrand = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  try {
    const brand = await Brand.findById(id);

    if (!brand) {
      return res.status(404).json({
        message: "brand data not found",
      });
    }
    if (brand) {
      res.status(200).json(brand);
    }
  } catch (error) {
    next(error);
  }
});

/**
 * @access public
 * @method post
 * @route api/brand
 */

export const createbrand = asyncHandler(async (req, res, next) => {
  const { name } = req.body;
  console.log(req.file);

  if (!name) {
    return res.status(404).json({
      message: "brand name is required!",
    });
  }

  const findUser = await Brand.findOne({ name });

  if (findUser) {
    return res.status(400).json({
      message: "brand Already exist",
    });
  }

  //   brand logo upload
  fs.writeFileSync("./" + req.file.originalname, req.file.buffer);
  const logo = await cloudinary.v2.uploader.upload(
    "./" + req.file.originalname,
    req.file.buffer
  );
  fs.unlinkSync("./" + req.file.originalname);

  try {
    const brand = await Brand.create({
      name,
      slug: createSlug(name),
      logo: logo.secure_url ? logo.secure_url : null,
    });
    res.status(200).json({
      message: "brand Created Successfull!",
      brand,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @access public
 * @method PUT/PATCH
 * @route api/brand:id
 */

export const updatebrand = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { name } = req.body;

  if (!name) {
    return res.status(404).json({
      message: "brand name is required!",
    });
  }
  try {
    const brand = await Brand.findByIdAndUpdate(
      id,
      { name, slug: createSlug(name) },
      { new: true }
    );
    res.status(200).json({ brand, message: "Brand updated successful" });
  } catch (error) {
    next(error);
  }
});

/**
 * @access public
 * @method delete
 * @route api/brand:id
 */

export const deletebrand = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  try {
    const brand = await Brand.findByIdAndDelete(id);
    res.status(200).json(brand);
  } catch (error) {
    next(error);
  }
});
