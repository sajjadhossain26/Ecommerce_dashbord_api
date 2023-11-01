import asyncHandler from "express-async-handler";
import Brand from "../models/Brand.js";
import { createSlug } from "../helper/slug.js";
// import { cloudUpload } from "../utilities/cloudinary.js";
import cloudinary from "cloudinary";
import { cloudDelete, cloudUpload } from "../utilities/cloudinary.js";
import { findPublicId } from "../helper/helpers.js";

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

  let logoData = null;
  if (req.file) {
    logoData = await cloudUpload(req);
  }
  console.log(logoData);
  try {
    const brand = await Brand.create({
      name,
      slug: createSlug(name),
      logo: logoData.secure_url ? logoData.secure_url : null,
    });
    res.status(200).json({
      message: "brand Created Successfull!",
      brand,
    });
  } catch (error) {
    console.log(error);
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

  const brandUpdate = await Brand.findById(id);
  if (!brandUpdate) {
    return res.status(404).json({
      message: "brand data not found",
    });
  }
  let updateLogo = brandUpdate.logo;
  if (req.file) {
    const logo = await cloudUpload(req);
    updateLogo = logo.secure_url;
    await cloudDelete(findPublicId(brandUpdate.logo));
  }

  brandUpdate.name = name;
  brandUpdate.slug = createSlug(name);
  brandUpdate.logo = updateLogo;
  brandUpdate.save();

  res.status(200).json({
    message: "Brand data updated successfull",
  });
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
    const publicId = findPublicId(brand.logo);
    cloudDelete(publicId);

    res.status(200).json(brand);
  } catch (error) {
    next(error);
  }
});
