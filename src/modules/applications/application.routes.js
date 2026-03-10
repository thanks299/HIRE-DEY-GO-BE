import express from "express";
import {
  createApplication,
  getMyApplications,
  getSingleApplication,
  updateApplication,
  deleteApplication,
} from "./application.controller.js";
import verifyToken, { authorize } from "../../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/applications", verifyToken, authorize("CANDIDATE"), createApplication);
router.get("/applications", verifyToken, authorize("CANDIDATE"), getMyApplications);
router.get("/applications/:id", verifyToken, authorize("CANDIDATE"), getSingleApplication);
router.put("/applications/:id", verifyToken, authorize("CANDIDATE"), updateApplication);
router.delete("/applications/:id", verifyToken, authorize("CANDIDATE"), deleteApplication);

export default router;