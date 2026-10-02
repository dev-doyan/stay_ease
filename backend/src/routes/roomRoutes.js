import express from "express";

import {
  createRoom,
  getRooms,
  getRoom,
  updateRoom,
  updateRoomStatus,
  deleteRoom,
} from "../controller/roomController.js";

import { authenticateUser } from "../middlewear/authenticate.js";

const router = express.Router();

// Guest + Staff
router.get("/", getRooms);
router.get("/:id", getRoom);

// Staff only
router.post("/", authenticateUser, createRoom);

router.patch(
  "/:id",
  authenticateUser,
  updateRoom
);

router.patch(
  "/:id/status",
  authenticateUser,
  updateRoomStatus
);

router.delete(
  "/:id",
  authenticateUser,
  deleteRoom
);

export default router;