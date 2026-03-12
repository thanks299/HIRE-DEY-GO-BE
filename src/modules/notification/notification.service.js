import Notification from "../../models/notification.js";

export const createNotification = async (data) => {
  return await Notification.create(data);
};

export const getNotifications = async () => {
  return await Notification
    .find()
    .sort({ createdAt: -1 })
    .limit(20);
};

export const markAsRead = async (id) => {
  return await Notification.findByIdAndUpdate(
    id,
    { isRead: true },
    { new: true }
  );
};
