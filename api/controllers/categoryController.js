import asyncHandler from "express-async-handler";

import Category from "../models/Category.js";
import { createSlug } from "../helper/slug.js";

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
  const { name, parentCategory } = req.body;

  if (!name) {
    return res.status(404).json({
      message: "category name is required!",
    });
  }

  const findUser = await Category.findOne({ name });

  if (findUser) {
    return res.status(400).json({
      message: "category Already exist",
    });
  }

  try {
    const category = await Category.create({
      name,
      slug: createSlug(name),
      parentCategory: parentCategory ? parentCategory : null,
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
  const { name } = req.body;

  if (!name) {
    return res.status(404).json({
      message: "category name is required!",
    });
  }
  try {
    const category = await Category.findByIdAndUpdate(
      id,
      { name, slug: createSlug(name) },
      { new: true }
    );
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
    res.status(200).json(category);
  } catch (error) {
    next(error);
  }
});
