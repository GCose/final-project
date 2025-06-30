const Role = require("../models/Role");
const defaultRoles = require("../data/defaultRoles");

const seedRoles = async () => {
  try {
    const roleCount = await Role.countDocuments();

    if (roleCount === 0) {
      await Role.insertMany(defaultRoles);
      console.log("Default roles created successfully");
    } else {
      console.log("Roles already exist, skipping role seeding");
    }
  } catch (error) {
    console.error("Error seeding roles:", error);
    throw error;
  }
};

module.exports = { seedRoles };
