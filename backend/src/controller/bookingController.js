import { eq, and, lt, gt, ne } from "drizzle-orm";

import db from "../db/index.js";
import { bookings, rooms } from "../models/index.js";


// CREATE BOOKING
export const createBooking = async (req, res) => {
  try {
    const { roomId, checkIn, checkOut } = req.body;

    if (!roomId || !checkIn || !checkOut) {
      return res.status(400).json({
        message: "roomId, checkIn and checkOut are required",
      });
    }

    if (checkIn >= checkOut) {
      return res.status(400).json({
        message: "Check-out date must be after check-in date",
      });
    }

    const [room] = await db
      .select()
      .from(rooms)
      .where(eq(rooms.id, roomId));

    if (!room) {
      return res.status(404).json({
        message: "Room not found",
      });
    }

    const [existingBooking] = await db
      .select()
      .from(bookings)
      .where(
        and(
          eq(bookings.roomId, roomId),
          ne(bookings.status, "CANCELLED"),
          lt(bookings.checkIn, checkOut),
          gt(bookings.checkOut, checkIn)
        )
      );

    if (existingBooking) {
      return res.status(409).json({
        message: "Room is already booked for these dates",
      });
    }

    const [booking] = await db
      .insert(bookings)
      .values({
        userId: req.user.userId,
        roomId,
        checkIn,
        checkOut,
        status: "CONFIRMED",
      })
      .returning();

    return res.status(201).json({
      message: "Booking created successfully",
      booking,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};


// GET MY BOOKINGS
export const getMyBookings = async (req, res) => {
  try {
    const userBookings = await db
      .select({
        id: bookings.id,
        roomId: bookings.roomId,
        checkIn: bookings.checkIn,
        checkOut: bookings.checkOut,
        status: bookings.status,
        createdAt: bookings.createdAt,
        roomNumber: rooms.roomNumber,
        roomType: rooms.roomType,
        pricePerNight: rooms.pricePerNight,
      })
      .from(bookings)
      .innerJoin(
        rooms,
        eq(bookings.roomId, rooms.id)
      )
      .where(eq(bookings.userId, req.user.userId));

    return res.status(200).json({
      bookings: userBookings,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};


// GET SINGLE BOOKING
export const getBooking = async (req, res) => {
  try {
    const { id } = req.params;

    const [booking] = await db
      .select({
        id: bookings.id,
        userId: bookings.userId,
        roomId: bookings.roomId,
        checkIn: bookings.checkIn,
        checkOut: bookings.checkOut,
        status: bookings.status,
        createdAt: bookings.createdAt,
        roomNumber: rooms.roomNumber,
        roomType: rooms.roomType,
        pricePerNight: rooms.pricePerNight,
      })
      .from(bookings)
      .innerJoin(
        rooms,
        eq(bookings.roomId, rooms.id)
      )
      .where(eq(bookings.id, id));

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    // Guest can only see their own booking
    if (
      req.user.role !== "STAFF" &&
      booking.userId !== req.user.userId
    ) {
      return res.status(403).json({
        message: "Access denied",
      });
    }

    return res.status(200).json({
      booking,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};


// CANCEL BOOKING
export const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;

    const [booking] = await db
      .select()
      .from(bookings)
      .where(eq(bookings.id, id));

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    if (
      req.user.role !== "STAFF" &&
      booking.userId !== req.user.userId
    ) {
      return res.status(403).json({
        message: "Access denied",
      });
    }

    if (booking.status !== "CONFIRMED") {
      return res.status(400).json({
        message: "Only confirmed bookings can be cancelled",
      });
    }

    const [updatedBooking] = await db
      .update(bookings)
      .set({
        status: "CANCELLED",
        updatedAt: new Date(),
      })
      .where(eq(bookings.id, id))
      .returning();

    return res.status(200).json({
      message: "Booking cancelled successfully",
      booking: updatedBooking,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};


// STAFF - GET ALL BOOKINGS
export const getAllBookings = async (req, res) => {
  try {
    if (req.user.role !== "STAFF") {
      return res.status(403).json({
        message: "Staff access required",
      });
    }

    const allBookings = await db
      .select({
        id: bookings.id,
        userId: bookings.userId,
        roomId: bookings.roomId,
        checkIn: bookings.checkIn,
        checkOut: bookings.checkOut,
        status: bookings.status,
        createdAt: bookings.createdAt,
        roomNumber: rooms.roomNumber,
        roomType: rooms.roomType,
        pricePerNight: rooms.pricePerNight,
      })
      .from(bookings)
      .innerJoin(
        rooms,
        eq(bookings.roomId, rooms.id)
      );

    return res.status(200).json({
      bookings: allBookings,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};


// STAFF - CHECK IN
export const checkInBooking = async (req, res) => {
  try {
    if (req.user.role !== "STAFF") {
      return res.status(403).json({
        message: "Staff access required",
      });
    }

    const { id } = req.params;

    const [booking] = await db
      .select()
      .from(bookings)
      .where(eq(bookings.id, id));

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    if (booking.status !== "CONFIRMED") {
      return res.status(400).json({
        message: "Only confirmed bookings can be checked in",
      });
    }

    const [updatedBooking] = await db
      .update(bookings)
      .set({
        status: "CHECKED_IN",
        updatedAt: new Date(),
      })
      .where(eq(bookings.id, id))
      .returning();

    await db
      .update(rooms)
      .set({
        status: "OCCUPIED",
        updatedAt: new Date(),
      })
      .where(eq(rooms.id, booking.roomId));

    return res.status(200).json({
      message: "Guest checked in successfully",
      booking: updatedBooking,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};


// STAFF - CHECK OUT
export const checkOutBooking = async (req, res) => {
  try {
    if (req.user.role !== "STAFF") {
      return res.status(403).json({
        message: "Staff access required",
      });
    }

    const { id } = req.params;

    const [booking] = await db
      .select()
      .from(bookings)
      .where(eq(bookings.id, id));

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    if (booking.status !== "CHECKED_IN") {
      return res.status(400).json({
        message: "Only checked-in bookings can be checked out",
      });
    }

    const [updatedBooking] = await db
      .update(bookings)
      .set({
        status: "CHECKED_OUT",
        updatedAt: new Date(),
      })
      .where(eq(bookings.id, id))
      .returning();

    await db
      .update(rooms)
      .set({
        status: "AVAILABLE",
        updatedAt: new Date(),
      })
      .where(eq(rooms.id, booking.roomId));

    return res.status(200).json({
      message: "Guest checked out successfully",
      booking: updatedBooking,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: error.message,
    });
  }
};