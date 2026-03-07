


import { Router } from 'express';
import { signup, loginUser, verifyEmail, refreshToken } from '../controllers/authControllers.js';

const router = Router();

router.post('/signup', signup);
router.post('/login', loginUser);
router.post("/verify-email", verifyEmail)
router.post("/refresh", refreshToken);

export { router };