const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/bookingController");
const { authenticateToken, authorizeRoles } = require("../middleware/auth");

router.use(authenticateToken);

router.get("/", bookingController.getAllBookings);
router.get(
  "/stats",
  authorizeRoles("Admin"),
  bookingController.getBookingStats
);
router.get("/:id", bookingController.getBookingById);
router.post("/", bookingController.createBooking);
router.put("/:id", bookingController.updateBooking);
router.put("/:id/cancel", bookingController.cancelBooking);

module.exports = router;
