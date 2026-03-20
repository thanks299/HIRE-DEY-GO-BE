import mongoose from "mongoose";
import Application from "../../models/application.model.js";
import "../../models/assessmentResult.model.js";
import { createNotification } from "../notification/notification.service.js";
import { NotificationTypes, createNotificationMessage } from "../notification/notification.templates.js";
import Job from "../../models/job.model.js";

export const createApplication = async (req, res) => {
  try {
    const { jobId, coverLetter, resumeUrl } = req.body;
    const { userId } = req.user;

    if (!jobId) {
      return res.status(400).json({
        success: false,
        message: "jobId is required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid jobId",
      });
    }

    const existingApplication = await Application.findOne({
      jobId,
      userId: userId,
    });

    if (existingApplication) {
      return res.status(409).json({
        success: false,
        message: "You have already applied for this job",
      });
    }

    const application = await Application.create({
      jobId,
      userId: userId,
      coverLetter,
      resumeUrl,
    });

    // Create a notification for the new application
    const job = await Job.findById(jobId);
    if (job) {
      await createNotification({
        type: NotificationTypes.NEW_APPLICATION,
        message: createNotificationMessage(NotificationTypes.NEW_APPLICATION, {
          email: req.user.email,
          jobTitle: job.title,
        }),
      });
    }

    return res.status(201).json({
      success: true,
      message: "Application created successfully",
      data: application,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to create application",
      error: error.message,
    });
  }
};

export const getMyApplications = async (req, res) => {
  try {
    const {userId} = req.user;

    const applications = await Application.find({ userId })
      .populate("jobId")
      .populate("userId", "-password")
      .populate("assessmentResultId")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Applications fetched successfully",
      count: applications.length,
      data: applications,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch applications",
      error: error.message,
    });
  }
};

export const getSingleApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.user;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid application id",
      });
    }

    const application = await Application.findOne({
      _id: id,
      userId: userId,
    })
      .populate("jobId")
      .populate("userId", "-password")
      .populate("assessmentResultId");

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Application fetched successfully",
      data: application,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch application",
      error: error.message,
    });
  }
};

export const updateApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const { coverLetter, resumeUrl } = req.body;
    const { userId } = req.user;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid application id",
      });
    }

    const application = await Application.findOneAndUpdate(
      { _id: id, userId: userId },
      { coverLetter, resumeUrl },
      { new: true, runValidators: true }
    );

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Application updated successfully",
      data: application,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update application",
      error: error.message,
    });
  }
};

export const deleteApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.user;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid application id",
      });
    }

    const application = await Application.findOneAndDelete({
      _id: id,
      userId: userId,
    });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Application deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete application",
      error: error.message,
    });
  }
};

export const updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, interviewDate, interviewNotes } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid application id",
      });
    }

    const allowedStatuses = [
      "APPLIED",
      "ASSESSED",
      "SHORTLISTED",
      "INTERVIEW",
      "HIRED",
      "REJECTED",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Allowed values: ${allowedStatuses.join(", ")}`,
      });
    }

    const updateData = { status };

    if (interviewDate) updateData.interviewDate = interviewDate;
    if (interviewNotes) updateData.interviewNotes = interviewNotes;

    const application = await Application.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    await createNotification({
      type: NotificationTypes.APPLICATION_STATUS_UPDATED,
      message: createNotificationMessage(NotificationTypes.APPLICATION_STATUS_UPDATED, {
      status,
      jobTitle: application.jobId.title,}),
      userId: application.userId,
    });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Application status updated successfully",
      data: application,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update application status",
      error: error.message,
    });
  }
};

export const getJobApplications = async (req, res) => {
  try {
    const { jobId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid jobId",
      });
    }

    const page = Math.max(1, Number.parseInt(req.query.page) || 1);
    const limit = 10;
    const skip = (page - 1) * limit;

    const filter = { jobId };
    if (req.query.status) filter.status = req.query.status.toUpperCase();

    const applications = await Application.find(filter)
      .populate("userId", "-password")
      .populate("jobId")
      .populate("assessmentResultId")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Application.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);

    return res.status(200).json({
      success: true,
      message: "Applications fetched successfully",
      meta: {
        total,
        current_page: page,
        per_page: limit,
        total_pages: totalPages,
        length: applications.length,
      },
      data: applications,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch applications",
      error: error.message,
    });
  }
};