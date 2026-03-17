import * as notificationService from "./notification.service.js";

export const getNotifications = async (req, res) => {
  try {
    const userId = req.user?._id || null;
    const notifications = await notificationService.getNotifications(userId);
    res.json({
      success: true,
      data: notifications,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export const markAsRead = async (req, res) => {
  try {
    const notification = await notificationService.markAsRead(req.params.id);
    res.json({
      success: true,
      data: notification,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export const deleteNotification = async (req, res) => {
  try {
    const notification = await notificationService.deleteNotification(req.params.id);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    res.json({
      success: true,
      message: "Notification deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export const markAllAsRead = async (req, res) => {
  try {
    const userId = req.user?._id || null;
    await notificationService.markAllAsRead(userId);

    res.json({
      success: true,
      message: "All notifications marked as read",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};