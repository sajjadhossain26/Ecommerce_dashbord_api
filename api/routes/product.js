import express from "express";
import tokenVerify from "../middlewares/verifyToken.js";
import multer from "multer";

import {
  createproduct,
  deleteproduct,
  getAllproduct,
  getSingleproduct,
  updateproduct,
} from "../controllers/productController.js";
// import { productLogo } from "../utilities/multer.js";

const router = express.Router();

router.use(tokenVerify);

// route rest api
router.route("/").get(getAllproduct).post(createproduct);
router
  .route("/:id")
  .get(getSingleproduct)
  .put(updateproduct)
  .patch(updateproduct)
  .delete(deleteproduct);

// route

export default router;
