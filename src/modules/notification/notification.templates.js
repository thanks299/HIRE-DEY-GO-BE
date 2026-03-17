// src/modules/notification/notification.template.js

export const NotificationTypes = {
  NEW_RECRUITER: "NEW_RECRUITER",
  NEW_CANDIDATE: "NEW_CANDIDATE",
  NEW_APPLICATION: "NEW_APPLICATION",
  APPLICATION_STATUS_UPDATED: "APPLICATION_STATUS_UPDATED",
  NEW_JOB_POSTED: "NEW_JOB_POSTED",
  JOB_CLOSED: "JOB_CLOSED",
  OTP_REQUESTED: "OTP_REQUESTED",
  PASSWORD_RESET: "PASSWORD_RESET",
};

export const createNotificationMessage = (type, data = {}) => {
  const templates = {
    [NotificationTypes.NEW_RECRUITER]: `A new recruiter registered: ${data.email || ""}`,
    [NotificationTypes.NEW_CANDIDATE]: `A new candidate registered: ${data.email || ""}`,
    [NotificationTypes.NEW_APPLICATION]: `A new application was submitted for job: ${data.jobTitle || ""}`,
    [NotificationTypes.APPLICATION_STATUS_UPDATED]: `Your application status has been updated to: ${data.status || ""}`,
    [NotificationTypes.NEW_JOB_POSTED]: `A new job has been posted: ${data.jobTitle || ""}`,
    [NotificationTypes.JOB_CLOSED]: `Job posting has been closed: ${data.jobTitle || ""}`,
    [NotificationTypes.OTP_REQUESTED]: `An OTP was requested for: ${data.email || ""}`,
    [NotificationTypes.PASSWORD_RESET]: `A password reset was requested for: ${data.email || ""}`,
  };

  return templates[type] || "You have a new notification";
};