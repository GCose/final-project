const Room = require("../models/Room");

const sampleRooms = [
  {
    roomNumber: "101",
    type: "Single",
    price: 99,
    capacity: 1,
    amenities: ["WiFi", "AC", "TV"],
    description: "Cozy single room perfect for solo travelers",
    floor: 1,
    images: ["https://via.placeholder.com/400x300?text=Single+Room"],
  },
  {
    roomNumber: "102",
    type: "Double",
    price: 149,
    capacity: 2,
    amenities: ["WiFi", "AC", "TV", "Mini Bar"],
    description: "Comfortable double room with modern amenities",
    floor: 1,
    images: ["https://via.placeholder.com/400x300?text=Double+Room"],
  },
  {
    roomNumber: "201",
    type: "Deluxe Double",
    price: 199,
    capacity: 2,
    amenities: ["WiFi", "AC", "TV", "Mini Bar", "Balcony", "City View"],
    description: "Luxurious double room with city view and balcony",
    floor: 2,
    images: ["https://via.placeholder.com/400x300?text=Deluxe+Double"],
  },
  {
    roomNumber: "301",
    type: "Suite",
    price: 299,
    capacity: 4,
    amenities: [
      "WiFi",
      "AC",
      "TV",
      "Mini Bar",
      "Kitchen",
      "Balcony",
      "Ocean View",
    ],
    description: "Spacious suite with kitchen and ocean view",
    floor: 3,
    images: ["https://via.placeholder.com/400x300?text=Suite"],
  },
  {
    roomNumber: "302",
    type: "Family Suite",
    price: 349,
    capacity: 6,
    amenities: [
      "WiFi",
      "AC",
      "TV",
      "Mini Bar",
      "Kitchen",
      "Balcony",
      "Ocean View",
      "Jacuzzi",
    ],
    description: "Perfect for families with separate bedrooms and living area",
    floor: 3,
    images: ["https://via.placeholder.com/400x300?text=Family+Suite"],
  },
];

module.exports = { sampleRooms };
