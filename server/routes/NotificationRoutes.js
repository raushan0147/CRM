const express = require("express");
const router = express.Router();
const { auth } = require("../middlewares/authMiddleware");
const { getNotifications, markAsRead } = require("../controllers/NotificationController");

router.use(auth);

router.get("/", getNotifications);
router.put("/read", markAsRead);

module.exports = router;
