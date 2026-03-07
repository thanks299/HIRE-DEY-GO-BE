import express from "express";
import {
  createApplication,
  getMyApplications,
  getSingleApplication,
  updateApplication,
  deleteApplication,
} from "../controllers/application.controller.js";
import { mockAuth } from "../middlewares/mockAuth.js";

const router = express.Router();

router.post("/", mockAuth, createApplication);
router.get("/my", mockAuth, getMyApplications);
router.get("/:id", mockAuth, getSingleApplication);
router.put("/:id", mockAuth, updateApplication);
router.delete("/:id", mockAuth, deleteApplication);

export default router;