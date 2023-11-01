import express from "express";
import tokenVerify from "../middlewares/verifyToken.js";
import multer from "multer";

import {
  createbrand,
  deletebrand,
  getAllbrand,
  getSinglebrand,
  updatebrand,
} from "../controllers/brandController.js";
import { brandLogo } from "../utilities/multer.js";

const router = express.Router();

router.use(tokenVerify);

// route rest api
router.route("/").get(getAllbrand).post(brandLogo, createbrand);
router
  .route("/:id")
  .get(getSinglebrand)
  .put(brandLogo, updatebrand)
  .patch(brandLogo, updatebrand)
  .delete(deletebrand);

// route

export default router;
