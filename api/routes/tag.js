import express from "express";
import tokenVerify from "../middlewares/verifyToken.js";
import {
  createtag,
  deletetag,
  getAlltag,
  getSingletag,
  updatetag,
} from "../controllers/tagController.js";

const router = express.Router();

router.use(tokenVerify);

// route rest api
router.route("/").get(getAlltag).post(createtag);
router
  .route("/:id")
  .get(getSingletag)
  .put(updatetag)
  .patch(updatetag)
  .delete(deletetag);

// route

export default router;
