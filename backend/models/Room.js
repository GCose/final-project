const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema(
  {
    roomNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    type: {
      type: String,
      required: true,
      enum: [
        "Single",
        "Double",
        "Suite",
        "Deluxe Single",
        "Deluxe Double",
        "Family Suite",
      ],
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    capacity: {
      type: Number,
      required: true,
      min: 1,
      max: 8,
    },
    amenities: [
      {
        type: String,
        enum: [
          "WiFi",
          "AC",
          "TV",
          "Mini Bar",
          "Balcony",
          "Kitchen",
          "Jacuzzi",
          "Ocean View",
          "City View",
          "Room Service",
        ],
      },
    ],
    description: {
      type: String,
      required: true,
      maxlength: 500,
    },
    images: [
      {
        type: String,
        default: "https://via.placeholder.com/400x300?text=Hotel+Room",
      },
    ],
    isAvailable: {
      type: Boolean,
      default: true,
    },
    floor: {
      type: Number,
      required: true,
      min: 1,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Room", roomSchema);
