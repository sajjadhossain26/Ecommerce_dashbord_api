import asyncHandler from "express-async-handler";
import Product from "../models/Product.js";
import { createSlug } from "../helper/slug.js";
import {
  cloudDelete,
  cloudUpload,
  cloudUploads,
} from "../utilities/cloudinary.js";
import { findPublicId } from "../helper/helpers.js";

/**
 * @access public
 * @method GET
 * @route api/product
 */

export const getAllproduct = asyncHandler(async (req, res, next) => {
  try {
    const products = await Product.find();

    if (!products) {
      return res.status(404).json({
        message: "product data not found",
      });
    }
    if (products.length > 0) {
      res.status(200).json(products);
    }
  } catch (error) {
    next(error);
  }
});

/**
 * @access public
 * @method GET
 * @route api/product:id
 */

export const getSingleproduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  try {
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        message: "product data not found",
      });
    }
    if (product) {
      res.status(200).json(product);
    }
  } catch (error) {
    next(error);
  }
});

/**
 * @access public
 * @method post
 * @route api/product
 */

export const createproduct = asyncHandler(async (req, res, next) => {
  const {
    name,
    productType,
    productSimple,
    productVariable,
    productGroup,
    productExternal,
    shortDesc,
    longDesc,
  } = req.body;

  if (!name) {
    return res.status(404).json({
      message: "product name is required!",
    });
  }

  const findUser = await Product.findOne({ name });

  if (findUser) {
    return res.status(400).json({
      message: "product Already exist",
    });
  }

  //   let logoData = null;
  //   if (req.file) {
  //     logoData = await cloudUpload(req);
  //   }
  const simpleData = JSON.parse(productSimple);

  const productPhotos = [];

  if (req.files) {
    for (let i = 0; i < req.files.length; i++) {
      const fileData = await cloudUploads(req.files[i].path);
      productPhotos.push(fileData);
    }
  }

  try {
    const product = await Product.create({
      name,
      slug: createSlug(name),
      productType,
      productSimple:
        productType == "simple" ? { ...simpleData, productPhotos } : null,
      productVariable: productType == "variable" ? productVariable : null,
      productGroup: productType == "group" ? productGroup : null,
      productExternal: productType == "external" ? productExternal : null,
      shortDesc,
      longDesc,
    });
    res.status(200).json({
      message: "product Created Successfull!",
      product,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @access public
 * @method PUT/PATCH
 * @route api/product:id
 */

export const updateproduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { name } = req.body;

  if (!name) {
    return res.status(404).json({
      message: "product name is required!",
    });
  }

  const productUpdate = await Product.findById(id);
  if (!productUpdate) {
    return res.status(404).json({
      message: "product data not found",
    });
  }
  let updateLogo = productUpdate.logo;
  if (req.file) {
    const logo = await cloudUpload(req);
    updateLogo = logo.secure_url;
    await cloudDelete(findPublicId(productUpdate.logo));
  }

  productUpdate.name = name;
  productUpdate.slug = createSlug(name);
  productUpdate.logo = updateLogo;
  productUpdate.save();

  res.status(200).json({
    message: "Product data updated successfull",
  });
});

/**
 * @access public
 * @method delete
 * @route api/product:id
 */

export const deleteproduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  try {
    const product = await Product.findByIdAndDelete(id);
    const publicId = findPublicId(product.logo);
    cloudDelete(publicId);

    res.status(200).json(product);
  } catch (error) {
    next(error);
  }
});
