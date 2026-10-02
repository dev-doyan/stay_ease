import {
  uuid,
  pgTable,
  varchar,
  text,
  pgEnum,
  integer,
  timestamp,
  decimal,
} from "drizzle-orm/pg-core";

export const roomTypeEnum = pgEnum("room_type", [
  "SINGLE",
  "DOUBLE",
]);

export const roomStatusEnum = pgEnum("room_status", [
  "AVAILABLE",
  "OCCUPIED",
]);

export const rooms = pgTable("rooms", {
  id: uuid().defaultRandom().primaryKey(),

  roomNumber: varchar({ length: 20 })
    .notNull()
    .unique(),

  roomType: roomTypeEnum("room_type")
    .notNull(),

  description: text(),

  pricePerNight: decimal({
    precision: 10,
    scale: 2,
  }).notNull(),

  capacity: integer().notNull(),

  status: roomStatusEnum("status")
    .default("AVAILABLE")
    .notNull(),

  createdAt: timestamp()
    .defaultNow()
    .notNull(),

  updatedAt: timestamp()
    .defaultNow()
    .notNull(),
});