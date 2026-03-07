


import { Router } from 'express';
import { signup, loginUser, verify } from '../controllers/authControllers.js';

const router = Router();

router.post('/signup', signup);
router.post('/login', loginUser);
router.post("/verify-email", verify)

export { router };