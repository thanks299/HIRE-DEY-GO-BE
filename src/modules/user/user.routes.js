import express from 'express';
import * as userController from './user.controller.js';
import { upload } from '../../utils/upload.util.js';
import { validateProfileUpdate } from './user.validation.js';
import { verifyToken } from '../../middlewares/auth.middleware.js'; 
import { validate } from '../../middlewares/validate.middleware.js';

const router = express.Router();

// protect all profile routes
router.use(verifyToken); 

router.get('/', userController.getMyProfile);

router.put(
  '/', 
  validate(validateProfileUpdate), 
  userController.updateMyProfile
);

// expects a file attached to the 'resume' form-data field
router.post(
  '/resume', 
  upload.single('resume'), 
  userController.uploadResume
);

export default router;