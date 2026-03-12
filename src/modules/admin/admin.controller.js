import * as adminService from "./admin.service.js";

export const getDashboardStats = async (req, res) => {
  const data = await adminService.getDashboardStats();
  res.json(data);
};

export const getRecruiterAnalytics = async (req, res) => {
  const data = await adminService.getRecruiterAnalytics();
  res.json(data);
};

export const getCandidateAnalytics = async (req, res) => {
  const data = await adminService.getCandidateAnalytics();
  res.json(data);
};

export const getPlatformAnalytics = async (req, res) => {
  const data = await adminService.getPlatformAnalytics();
  res.json(data);
};

export const getNotifications = async (req, res) => {
  const data = await adminService.getNotifications();
  res.json(data);
};

export const getUsers = async (req, res) => {
  const data = await adminService.getUsers();
  res.json(data);
};

export const suspendUser = async (req, res) => {
  const data = await adminService.suspendUser(req.params.id);
  res.json(data);
};

export const deleteUser = async (req, res) => {
  const data = await adminService.deleteUser(req.params.id);
  res.json(data);
};

export const moderateJob = async (req, res) => {
  const data = await adminService.moderateJob(req.params.id);
  res.json(data);
};