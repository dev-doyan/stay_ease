import {
  uuid,
  pgTable,
  date,
  pgEnum,
  timestamp,
} from "drizzle-orm/pg-core";

import { users } from "./userModel.js";
import { rooms } from "./roomModel.js";

export const bookingStatusEnum = pgEnum("booking_status", [
  "CONFIRMED",
  "CHECKED_IN",
  "CHECKED_OUT",
  "CANCELLED",
]);

export const bookings = pgTable("bookings", {
  id: uuid()
    .defaultRandom()
    .primaryKey(),

  userId: uuid()
    .notNull()
    .references(() => users.id, {
      onDelete: "cascade",
    }),

  roomId: uuid()
    .notNull()
    .references(() => rooms.id, {
      onDelete: "restrict",
    }),

  checkIn: date()
    .notNull(),

  checkOut: date()
    .notNull(),

  status: bookingStatusEnum("status")
    .default("CONFIRMED")
    .notNull(),

  createdAt: timestamp()
    .defaultNow()
    .notNull(),

  updatedAt: timestamp()
    .defaultNow()
    .notNull(),
});

