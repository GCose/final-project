const User = require("../models/User");
const Role = require("../models/Role");
const defaultUsers = require("../data/defaultUsers");

const seedUsers = async () => {
  try {
    for (const userData of defaultUsers) {
      const existingUser = await User.findOne({ email: userData.email });

      if (!existingUser) {
        const role = await Role.findOne({ name: userData.roleName });

        if (role) {
          await User.create({
            fullName: userData.fullName,
            email: userData.email,
            password: userData.password,
            role: role._id,
          });

          console.log(
            `Created user: ${userData.fullName} (${userData.email}) - ${userData.roleName}`
          );
        } else {
          console.log(
            `Role '${userData.roleName}' not found for user ${userData.email}`
          );
        }
      } else {
        console.log(`User already exists: ${userData.email}`);
      }
    }
  } catch (error) {
    console.error("Error seeding users:", error);
    throw error;
  }
};

module.exports = { seedUsers };
