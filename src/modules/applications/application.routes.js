import express from "express";
import {
  createApplication,
  getMyApplications,
  getSingleApplication,
  updateApplication,
  deleteApplication,
} from "./application.controller.js";
import { mockAuth } from "../../mockAuth.js";

const router = express.Router();

router.post("/applications", mockAuth, createApplication);
router.get("/applications", mockAuth, getMyApplications);
router.get("/applications/:id", mockAuth, getSingleApplication);
router.put("/applications/:id", mockAuth, updateApplication);
router.delete("/applications/:id", mockAuth, deleteApplication);

export default router;