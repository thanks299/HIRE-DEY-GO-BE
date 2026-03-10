import express from "express";
import {
  getMyProfile,
  createOrUpdateProfile,
} from "./profile.controller.js";
import { mockAuth } from "../../middlewares/mockAuth.js";

const router = express.Router();

router.get("/profile", mockAuth, getMyProfile);
router.put("/profile", mockAuth, createOrUpdateProfile);

export default router;