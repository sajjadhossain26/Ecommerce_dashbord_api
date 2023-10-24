import express from 'express';
import tokenVerify from '../middlewares/verifyToken.js';
import { createpermission, deletepermission, getAllpermission, getSinglepermission, updatepermission } from '../controllers/permissionController.js';

const router = express.Router();

router.use(tokenVerify)

// route rest api
router.route('/').get(getAllpermission).post(createpermission);
router.route('/:id').get(getSinglepermission).put(updatepermission).patch(updatepermission).delete(deletepermission)



// route


export default router