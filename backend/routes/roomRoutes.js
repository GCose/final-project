const express = require("express");
const router = express.Router();
const roomController = require("../controllers/roomController");
const { authenticateToken, authorizeRoles } = require("../middleware/auth");

router.use(authenticateToken);

router.get("/", roomController.getAllRooms);
router.get("/stats", roomController.getRoomStats);
router.get("/:id", roomController.getRoomById);

router.post("/", authorizeRoles("Admin"), roomController.createRoom);
router.put("/:id", authorizeRoles("Admin"), roomController.updateRoom);
router.delete("/:id", authorizeRoles("Admin"), roomController.deleteRoom);

module.exports = router;
