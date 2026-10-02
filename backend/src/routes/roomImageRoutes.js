import express from "express";

import {
  uploadRoomImage,
} from "../controller/roomImageController.js";

import { authenticateUser } from "../middlewear/authenticate.js";
import upload from "../middlewear/upload.js";

const router = express.Router();

router.post(
  "/rooms/:id/images",
  authenticateUser,
  upload.single("image"),
  uploadRoomImage
);

export default router;