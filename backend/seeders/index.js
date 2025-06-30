const { seedRoles } = require("./roleSeeder");
const { seedUsers } = require("./userSeeder");
const { seedRooms } = require("./roomsSeeder");

const runSeeders = async () => {
  try {
    console.log("Starting database seeding...");

    await seedRoles();
    await seedUsers();
    await seedRooms();

    console.log("Database seeding completed successfully");
  } catch (error) {
    console.error("Database seeding failed:", error);
    throw error;
  }
};

module.exports = { runSeeders };
