import * as notificationService from "./notification.service.js";

export const getNotifications = async (req, res) => {
  try {

    const notifications =
      await notificationService.getNotifications();

    res.json({
      success: true,
      data: notifications
    });

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }
};

export const markAsRead = async (req, res) => {

  try {

    const notification =
      await notificationService.markAsRead(req.params.id);

    res.json({
      success: true,
      data: notification
    });

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }

};