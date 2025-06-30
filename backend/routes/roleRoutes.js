const express = require("express");
const router = express.Router();
const roleController = require("../controllers/roleController");
const { authenticateToken, authorizeRoles } = require("../middleware/auth");

router.get("/", roleController.getAllRoles);
router.post(
  "/",
  authenticateToken,
  authorizeRoles("Admin"),
  roleController.createRole
);
router.put(
  "/:id",
  authenticateToken,
  authorizeRoles("Admin"),
  roleController.updateRole
);
router.delete(
  "/:id",
  authenticateToken,
  authorizeRoles("Admin"),
  roleController.deleteRole
);

module.exports = router;
