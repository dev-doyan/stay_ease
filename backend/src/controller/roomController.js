import { eq } from "drizzle-orm";

import db from "../db/index.js";
import { rooms } from "../models/index.js";


// CREATE ROOM
export const createRoom = async (req, res) => {
  try {
    if (req.user.role !== "STAFF") {
      return res.status(403).json({
        message: "Staff access required",
      });
    }

    const {
      roomNumber,
      roomType,
      description,
      pricePerNight,
      capacity,
    } = req.body;

    if (
      !roomNumber ||
      !roomType ||
      !pricePerNight ||
      !capacity
    ) {
      return res.status(400).json({
        message: "Room number, type, price and capacity are required",
      });
    }

    const existingRoom = await db
      .select()
      .from(rooms)
      .where(eq(rooms.roomNumber, roomNumber));

    if (existingRoom.length > 0) {
      return res.status(409).json({
        message: "Room number already exists",
      });
    }

    const room= await db
      .insert(rooms)
      .values({
        roomNumber,
        roomType,
        description,
        pricePerNight,
        capacity,
      })
      .returning();

    return res.status(201).json({
      message: "Room created successfully",
      room,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: error.message,
    });
  }
};


// GET ALL ROOMS
export const getRooms = async (req, res) => {
  try {
    const allRooms = await db
      .select()
      .from(rooms);

    return res.status(200).json({
      rooms: allRooms,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};


// GET room by id
export const getRoom = async (req, res) => {
  try {
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

    return res.status(200).json({
      room,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: error.message,
    });
  }
};


// UPDATE ROOM
export const updateRoom = async (req, res) => {
  try {
    if (req.user.role !== "STAFF") {
      return res.status(403).json({
        message: "Staff access required",
      });
    }

    const { id } = req.params;

    const {
      roomNumber,
      roomType,
      description,
      pricePerNight,
      capacity,
    } = req.body;

    const [existingRoom] = await db
      .select()
      .from(rooms)
      .where(eq(rooms.id, id));

    if (!existingRoom) {
      return res.status(404).json({
        message: "Room not found",
      });
    }

    const updatedRoom= await db
      .update(rooms)
      .set({
        roomNumber,
        roomType,
        description,
        pricePerNight,
        capacity,
        updatedAt: new Date(),
      })
      .where(eq(rooms.id, id))
      .returning();

    return res.status(200).json({
      message: "Room updated successfully",
      room: updatedRoom,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: error.message,
    });
  }
};


// UPDATE ROOM STATUS
export const updateRoomStatus = async (req, res) => {
  try {
    if (req.user.role !== "STAFF") {
      return res.status(403).json({
        message: "Staff access required",
      });
    }

    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        message: "Status is required",
      });
    }

    if (!["AVAILABLE", "OCCUPIED"].includes(status)) {
      return res.status(400).json({
        message: "Invalid room status",
      });
    }

    const room = await db
      .update(rooms)
      .set({
        status,
        updatedAt: new Date(),
      })
      .where(eq(rooms.id, id))
      .returning();

    if (!room) {
      return res.status(404).json({
        message: "Room not found",
      });
    }

    return res.status(200).json({
      message: "Room status updated successfully",
      room,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};


// DELETE ROOM
export const deleteRoom = async (req, res) => {
  try {
    if (req.user.role !== "STAFF") {
      return res.status(403).json({
        message: "Staff access required",
      });
    }

    const { id } = req.params;

    const [deletedRoom] = await db
      .delete(rooms)
      .where(eq(rooms.id, id))
      .returning();

    if (!deletedRoom) {
      return res.status(404).json({
        message: "Room not found",
      });
    }

    return res.status(200).json({
      message: "Room deleted successfully",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: error.message,
    });
  }
};