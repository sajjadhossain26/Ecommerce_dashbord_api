import express from 'express';
import tokenVerify from '../middlewares/verifyToken.js';
import { createrole, deleterole, getAllrole, getSinglerole, updaterole } from '../controllers/roleController.js';


const router = express.Router();

router.use(tokenVerify)

// route rest api
router.route('/').get(getAllrole).post(createrole);
router.route('/:id').get(getSinglerole).put(updaterole).patch(updaterole).delete(deleterole)



// route


export default router