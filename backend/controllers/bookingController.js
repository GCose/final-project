const Booking = require("../models/Booking");
const Room = require("../models/Room");

const getAllBookings = async (req, res) => {
  try {
    let query = {};

    // Non-admin users can only see their own bookings
    if (req.user.role.name !== "Admin") {
      query.user = req.user._id;
    }

    const bookings = await Booking.find(query)
      .populate("user", "fullName email")
      .populate("room", "roomNumber type price")
      .sort({ createdAt: -1 });

    res.json({
      message: "Bookings retrieved successfully",
      bookings,
      total: bookings.length,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving bookings", error: error.message });
  }
};

const getBookingById = async (req, res) => {
  try {
    let query = { _id: req.params.id };

    if (req.user.role.name !== "Admin") {
      query.user = req.user._id;
    }

    const booking = await Booking.findOne(query)
      .populate("user", "fullName email")
      .populate("room", "roomNumber type price amenities description");

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.json({ message: "Booking retrieved successfully", booking });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving booking", error: error.message });
  }
};

const createBooking = async (req, res) => {
  try {
    const {
      roomId,
      guestName,
      guestEmail,
      guestPhone,
      checkInDate,
      checkOutDate,
      numberOfGuests,
      specialRequests,
    } = req.body;

    const room = await Room.findById(roomId);
    if (!room || !room.isAvailable) {
      return res.status(400).json({ message: "Room not available" });
    }

    if (numberOfGuests > room.capacity) {
      return res.status(400).json({ message: "Too many guests for this room" });
    }

    // Calculate dates and cost
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
    const totalCost = nights * room.price;

    // Check for date conflicts
    const conflictingBooking = await Booking.findOne({
      room: roomId,
      status: { $in: ["confirmed", "checked-in"] },
      $or: [
        {
          checkInDate: { $lt: checkOut },
          checkOutDate: { $gt: checkIn },
        },
      ],
    });

    if (conflictingBooking) {
      return res
        .status(400)
        .json({ message: "Room is already booked for these dates" });
    }

    const booking = new Booking({
      user: req.user._id,
      room: roomId,
      guestName,
      guestEmail,
      guestPhone,
      checkInDate: checkIn,
      checkOutDate: checkOut,
      numberOfGuests,
      numberOfNights: nights,
      pricePerNight: room.price,
      totalCost,
      specialRequests,
      status: "confirmed",
    });

    await booking.save();

    const populatedBooking = await Booking.findById(booking._id).populate(
      "room",
      "roomNumber type amenities"
    );

    res.status(201).json({
      message: "Booking created successfully",
      booking: populatedBooking,
    });
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error creating booking", error: error.message });
  }
};

const updateBooking = async (req, res) => {
  try {
    let query = { _id: req.params.id };

    if (req.user.role.name !== "Admin") {
      query.user = req.user._id;
    }

    const booking = await Booking.findOneAndUpdate(query, req.body, {
      new: true,
    }).populate("room", "roomNumber type price");

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.json({ message: "Booking updated successfully", booking });
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error updating booking", error: error.message });
  }
};

const cancelBooking = async (req, res) => {
  try {
    let query = { _id: req.params.id };

    if (req.user.role.name !== "Admin") {
      query.user = req.user._id;
    }

    const booking = await Booking.findOne(query);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (booking.status === "cancelled") {
      return res.status(400).json({ message: "Booking is already cancelled" });
    }

    booking.status = "cancelled";
    await booking.save();

    res.json({ message: "Booking cancelled successfully", booking });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error cancelling booking", error: error.message });
  }
};

const getBookingStats = async (req, res) => {
  try {
    const totalBookings = await Booking.countDocuments();
    const confirmedBookings = await Booking.countDocuments({
      status: "confirmed",
    });
    const cancelledBookings = await Booking.countDocuments({
      status: "cancelled",
    });

    // Calculate total revenue
    const revenueData = await Booking.aggregate([
      { $match: { status: { $in: ["confirmed", "checked-out"] } } },
      { $group: { _id: null, totalRevenue: { $sum: "$totalCost" } } },
    ]);

    const totalRevenue =
      revenueData.length > 0 ? revenueData[0].totalRevenue : 0;

    res.json({
      message: "Booking statistics retrieved successfully",
      stats: {
        totalBookings,
        confirmedBookings,
        cancelledBookings,
        totalRevenue,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Error retrieving booking statistics",
        error: error.message,
      });
  }
};

module.exports = {
  getAllBookings,
  getBookingById,
  createBooking,
  updateBooking,
  cancelBooking,
  getBookingStats,
};
