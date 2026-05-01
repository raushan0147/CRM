const Notification = require("../modals/Notification");

exports.getNotifications = async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role; // 'admin' or 'superadmin'

    // Fetch notifications targeting this role or 'all'
    const query = {
      recipientRole: { $in: [userRole, "all"] },
    };

    const notifications = await Notification.find(query).sort({ createdAt: -1 }).limit(20);

    // Format them logically
    const formatted = notifications.map(notif => {
      const isRead = notif.readBy.includes(userId);
      return {
        _id: notif._id,
        title: notif.title,
        message: notif.message,
        createdAt: notif.createdAt,
        isRead
      };
    });

    return res.status(200).json({
      success: true,
      notifications: formatted
    });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const { notificationId } = req.body;
    const userId = req.user.id;

    if (!notificationId) {
      // Mark all as read
      const userRole = req.user.role;
      const notifications = await Notification.find({ recipientRole: { $in: [userRole, "all"] } });
      
      const updatePromises = notifications.map(async (notif) => {
         if (!notif.readBy.includes(userId)) {
            notif.readBy.push(userId);
            await notif.save();
         }
      });
      await Promise.all(updatePromises);
    } else {
      // Mark single as read
      const notification = await Notification.findById(notificationId);
      if (notification && !notification.readBy.includes(userId)) {
        notification.readBy.push(userId);
        await notification.save();
      }
    }

    return res.status(200).json({ success: true, message: "Marked as read" });
  } catch (error) {
    console.error("Error marking notification read:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
