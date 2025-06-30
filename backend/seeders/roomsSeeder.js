const Room = require("../models/Room");
const { sampleRooms } = require("../data/defaultRooms");

const seedRooms = async () => {
  try {
    await Room.deleteMany({});
    await Room.insertMany(sampleRooms);
    console.log("Sample rooms created successfully");
  } catch (error) {
    console.error("Error seeding rooms:", error);
  }
};

module.exports = { seedRooms };
