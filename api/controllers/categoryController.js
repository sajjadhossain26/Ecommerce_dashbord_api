import asyncHandler from "express-async-handler";

import Category from "../models/Category.js";
import { createSlug } from "../helper/slug.js";
import { cloudDelete, cloudUpload } from "../utilities/cloudinary.js";
import { findPublicId } from "../helper/helpers.js";

/**
 * @access public
 * @method GET
 * @route api/category
 */

export const getAllcategory = asyncHandler(async (req, res, next) => {
  try {
    const categorys = await Category.find().populate([
      {
        path: "subCategory",
        populate: {
          path: "subCategory",
          populate: {
            path: "subCategory",
          },
        },
      },
      {
        path: "parentCategory",
        populate: {
          path: "parentCategory",
          populate: {
            path: "parentCategory",
          },
        },
      },
    ]);

    if (!categorys) {
      return res.status(404).json({
        message: "category data not found",
      });
    }
    if (categorys.length > 0) {
      res.status(200).json(categorys);
    }
  } catch (error) {
    next(error);
  }
});

/**
 * @access public
 * @method GET
 * @route api/category:id
 */

export const getSinglecategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  try {
    const category = await Category.findById(id).populate([
      {
        path: "subCategory",
        populate: {
          path: "subCategory",
          populate: {
            path: "subCategory",
          },
        },
      },
      {
        path: "parentCategory",
        populate: {
          path: "parentCategory",
          populate: {
            path: "parentCategory",
          },
        },
      },
    ]);

    if (!category) {
      return res.status(404).json({
        message: "category data not found",
      });
    }
    if (category) {
      res.status(200).json(category);
    }
  } catch (error) {
    next(error);
  }
});

/**
 * @access public
 * @method post
 * @route api/category
 */

export const createcategory = asyncHandler(async (req, res, next) => {
  const { name, parentCategory, icon } = req.body;

  if (!name) {
    return res.status(404).json({
      message: "category name is required!",
    });
  }

  const findCategory = await Category.findOne({ name });

  if (findCategory) {
    return res.status(400).json({
      message: "category Already exist",
    });
  }

  // category icon
  let catIcon = null;
  if (icon) {
    catIcon = icon;
  }

  let catPhoto = null;
  if (req.file) {
    const cat = await cloudUpload(req);
    catPhoto = cat.secure_url;
  }

  try {
    const category = await Category.create({
      name,
      slug: createSlug(name),
      parentCategory: parentCategory ? parentCategory : null,
      icon: catIcon,
      photo: catPhoto,
    });

    if (parentCategory) {
      await Category.findByIdAndUpdate(parentCategory, {
        $push: { subCategory: category._id },
      });
    }
    res.status(200).json({
      message: "category Created Successfull!",
      category,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @access public
 * @method PUT/PATCH
 * @route api/category:id
 */

export const updatecategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { name, parentCategory, icon } = req.body;

  if (!name) {
    return res.status(404).json({
      message: "category name is required!",
    });
  }
  try {
    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({
        message: "Category not found",
      });
    }

    // parent category
    let parentCat = category.parentCategory;
    if (parentCategory) {
      parentCat = parentCategory;
    }

    // photo update
    let photo = category.photo;
    if (req.file) {
      const cloudPhoto = await cloudUpload(req);
      photo = cloudPhoto.secure_url;
      await cloudDelete(findPublicId(category.photo));
    }

    // icon update
    let updateIcon = category.icon;
    if (icon) {
      updateIcon = icon;
    }

    category.name = name;
    category.slug = createSlug(name);
    category.photo = photo;
    category.parentCategory = parentCat;
    category.icon = updateIcon;
    category.save();
    res.status(200).json({ category, message: "Category updated successful" });
  } catch (error) {
    next(error);
  }
});

/**
 * @access public
 * @method delete
 * @route api/category:id
 */

export const deletecategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  try {
    const category = await Category.findByIdAndDelete(id);
    await cloudDelete(findPublicId(category.photo));
    res.status(200).json(category);
  } catch (error) {
    next(error);
  }
});
