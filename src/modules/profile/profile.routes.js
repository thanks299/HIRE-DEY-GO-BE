import express from "express";
import {
  getMyProfile,
  createOrUpdateProfile,
} from "./profile.controller.js";
import verifyToken, { authorize } from "../../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/profile", verifyToken, authorize(["CANDIDATE", "RECRUITER"]), getMyProfile);
router.put("/profile", verifyToken, authorize(["CANDIDATE", "RECRUITER"]), createOrUpdateProfile);

export default router;