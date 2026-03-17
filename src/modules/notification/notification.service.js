import Notification from "../../models/notification.js";

export const createNotification = async (data) => {
  if (Array.isArray(data)) {
    return await Notification.insertMany(data);
  }
  return await Notification.create(data);
};

export const getNotifications = async (userId = null) => {
  const filter = userId
    ? { $or: [{ userId }, { userId: null }] }
    : {};

  return await Notification
    .find(filter)
    .sort({ createdAt: -1 })
    .limit(20);
};

export const markAsRead = async (id) => {
  return await Notification.findByIdAndUpdate(
    id,
    { isRead: true },
    { returnDocument: 'after' }
  );
};

export const deleteNotification = async (id) => {
  return await Notification.findByIdAndDelete(id);
};

export const markAllAsRead = async (userId = null) => {
  const filter = { isRead: false };
  
  if (userId) {
    filter.$or = [{ userId }, { userId: null }];
  }

  return await Notification.updateMany(filter, { isRead: true });
};