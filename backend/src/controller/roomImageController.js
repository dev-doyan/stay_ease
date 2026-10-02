import { eq } from "drizzle-orm";

import db from "../db/index.js";
import { rooms, roomImages } from "../models/index.js";

import cloudinary from "../utils/cloudinary.js";

export const uploadRoomImage = async (req, res) => {
  try {
    if (req.user.role !== "STAFF") {
      return res.status(403).json({
        message: "Staff access required",
      });
    }

    const { id } = req.params;

    const [room] = await db
      .select()
      .from(rooms)
      .where(eq(rooms.id, id));

    if (!room) {
      return res.status(404).json({
        message: "Room not found",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        message: "Image is required",
      });
    }

    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: "stayease/rooms",
          },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          }
        )
        .end(req.file.buffer);
    });

    const [image] = await db
      .insert(roomImages)
      .values({
        roomId: id,
        imageUrl: result.secure_url,
        publicId: result.public_id,
      })
      .returning();

    return res.status(201).json({
      message: "Room image uploaded successfully",
      image,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};