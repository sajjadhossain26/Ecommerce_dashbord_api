import express from "express";
import tokenVerify from "../middlewares/verifyToken.js";
import {
  createcategory,
  deletecategory,
  getAllcategory,
  getSinglecategory,
  updatecategory,
} from "../controllers/categoryController.js";
import { categoryPhoto } from "../utilities/multer.js";

const router = express.Router();

router.use(tokenVerify);

// route rest api
router.route("/").get(getAllcategory).post(categoryPhoto, createcategory);
router
  .route("/:id")
  .get(getSinglecategory)
  .put(categoryPhoto, updatecategory)
  .patch(categoryPhoto, updatecategory)
  .delete(deletecategory);

// route

export default router;
