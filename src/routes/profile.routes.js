import express from "express";
import {
  getMyProfile,
  createOrUpdateProfile,
} from "../controllers/profile.controller.js";
import { mockAuth } from "../middlewares/mockAuth.js";

const router = express.Router();

router.get("/", mockAuth, getMyProfile);
router.put("/", mockAuth, createOrUpdateProfile);

export default router;