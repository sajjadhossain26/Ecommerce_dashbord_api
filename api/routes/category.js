import express from "express";
import tokenVerify from "../middlewares/verifyToken.js";
import {
  createcategory,
  deletecategory,
  getAllcategory,
  getSinglecategory,
  updatecategory,
} from "../controllers/categoryController.js";

const router = express.Router();

router.use(tokenVerify);

// route rest api
router.route("/").get(getAllcategory).post(createcategory);
router
  .route("/:id")
  .get(getSinglecategory)
  .put(updatecategory)
  .patch(updatecategory)
  .delete(deletecategory);

// route

export default router;
