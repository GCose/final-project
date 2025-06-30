const Room = require("../models/Room");
const Booking = require("../models/Booking");

const getAllRooms = async (req, res) => {
  try {
    const { checkIn, checkOut, capacity, minPrice, maxPrice, type } = req.query;

    let query = { isAvailable: true };

    if (capacity) query.capacity = { $gte: parseInt(capacity) };
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }
    if (type) query.type = type;

    const rooms = await Room.find(query).sort({ price: 1 });

    // Filter out booked rooms if dates provided
    let availableRooms = rooms;
    if (checkIn && checkOut) {
      const checkInDate = new Date(checkIn);
      const checkOutDate = new Date(checkOut);

      const conflictingBookings = await Booking.find({
        status: { $in: ["confirmed", "checked-in"] },
        $or: [
          {
            checkInDate: { $lt: checkOutDate },
            checkOutDate: { $gt: checkInDate },
          },
        ],
      }).select("room");

      const bookedRoomIds = conflictingBookings.map((booking) =>
        booking.room.toString()
      );
      availableRooms = rooms.filter(
        (room) => !bookedRoomIds.includes(room._id.toString())
      );
    }

    res.json({
      message: "Rooms retrieved successfully",
      rooms: availableRooms,
      total: availableRooms.length,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving rooms", error: error.message });
  }
};

const getRoomById = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }
    res.json({ message: "Room retrieved successfully", room });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving room", error: error.message });
  }
};

const createRoom = async (req, res) => {
  try {
    const room = new Room(req.body);
    await room.save();
    res.status(201).json({ message: "Room created successfully", room });
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ message: "Room number already exists" });
    } else {
      res
        .status(400)
        .json({ message: "Error creating room", error: error.message });
    }
  }
};

const updateRoom = async (req, res) => {
  try {
    const room = await Room.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }
    res.json({ message: "Room updated successfully", room });
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error updating room", error: error.message });
  }
};

const deleteRoom = async (req, res) => {
  try {
    const activeBookings = await Booking.countDocuments({
      room: req.params.id,
      status: { $in: ["confirmed", "checked-in"] },
    });

    if (activeBookings > 0) {
      return res
        .status(400)
        .json({ message: "Cannot delete room with active bookings" });
    }

    const room = await Room.findByIdAndDelete(req.params.id);
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }
    res.json({ message: "Room deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting room", error: error.message });
  }
};

const getRoomStats = async (req, res) => {
  try {
    const totalRooms = await Room.countDocuments();
    const availableRooms = await Room.countDocuments({ isAvailable: true });
    const occupancyRate =
      totalRooms > 0
        ? Math.round(((totalRooms - availableRooms) / totalRooms) * 100)
        : 0;

    res.json({
      message: "Room statistics retrieved successfully",
      stats: { totalRooms, availableRooms, occupancyRate },
    });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Error retrieving room statistics",
        error: error.message,
      });
  }
};

module.exports = {
  getAllRooms,
  getRoomById,
  createRoom,
  updateRoom,
  deleteRoom,
  getRoomStats,
};
