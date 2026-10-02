import express from "express";

import {
  createBooking,
  getMyBookings,
  getBooking,
  cancelBooking,
  getAllBookings,
  checkInBooking,
  checkOutBooking,
} from "../controller/bookingController.js";

import { authenticateUser } from "../middlewear/authenticate.js";

const router = express.Router();


// Create booking
router.post(
  "/",
  authenticateUser,
  createBooking
);


// Get my bookings
router.get(
  "/my",
  authenticateUser,
  getMyBookings
);


// Get single booking
router.get(
  "/:id",
  authenticateUser,
  getBooking
);


// Cancel booking
router.patch(
  "/:id/cancel",
  authenticateUser,
  cancelBooking
);


// Staff - get all bookings
router.get(
  "/",
  authenticateUser,
  getAllBookings
);


// Staff - check in
router.patch(
  "/:id/check-in",
  authenticateUser,
  checkInBooking
);


// Staff - check out
router.patch(
  "/:id/check-out",
  authenticateUser,
  checkOutBooking
);


export default router;