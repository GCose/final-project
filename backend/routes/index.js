const roleRoutes = require("./roleRoutes");
const authRoutes = require("./authRoutes");
const userRoutes = require("./userRoutes");
const roomRoutes = require("./roomRoutes");
const bookingRoutes = require("./bookingRoutes");
const { Router } = require("express");
const router = Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/roles", roleRoutes);
router.use("/rooms", roomRoutes);
router.use("/bookings", bookingRoutes);

module.exports = router;
