import {
  uuid,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

import { rooms } from "./roomModel.js";

export const roomImages = pgTable("room_images", {
  id: uuid().defaultRandom().primaryKey(),

  roomId: uuid()
    .notNull()
    .references(() => rooms.id, {
      onDelete: "cascade",
    }),

  imageUrl: text().notNull(),

  publicId: text(),

  createdAt: timestamp()
    .defaultNow()
    .notNull(),
});