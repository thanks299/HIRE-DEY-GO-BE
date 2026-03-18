import asyncHandler from "../../utils/asyncHandler.js";
import * as cvService from "./cv.service.js";

// POST /api/v1/cv/upload
export const uploadCV = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: "No file uploaded" });
  }

  const result = await cvService.uploadCV(
    req.user.userId,
    req.file.buffer,
    req.file.mimetype,
    req.file.originalname
  );

  res.status(200).json({
    success: true,
    message: "CV uploaded successfully",
    data: result,
  });
});

// POST /api/v1/cv/parse
export const parseCV = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: "No file uploaded" });
  }

  const parsed = await cvService.parseCV(req.user.userId, req.file.buffer);

  res.status(200).json({
    success: true,
    message: "CV parsed successfully. Review the data and call /cv/apply to update your profile.",
    data: parsed,
  });
});

// POST /api/v1/cv/apply
export const applyParsedCV = asyncHandler(async (req, res) => {
  const profile = await cvService.applyParsedCV(req.user.userId);

  res.status(200).json({
    success: true,
    message: "CV data applied to your profile successfully",
    data: profile,
  });
});
