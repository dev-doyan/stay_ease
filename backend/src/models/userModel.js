import {uuid,pgTable,varchar,text,pgEnum,timestamp,index} from "drizzle-orm/pg-core";

export const userRoleEnum = pgEnum("user_role", [
  "GUEST",
  "STAFF",
]);


export const users = pgTable("users", {
  id: uuid().defaultRandom().primaryKey(),

  name: varchar({ length: 100 }).notNull(),

  email: varchar({ length: 300 })
    .notNull()
    .unique(),

  passwordHash: text().notNull(), //hashed password 

  role: userRoleEnum("role")
    .default("GUEST")
    .notNull(),

  createdAt: timestamp()
    .defaultNow()
    .notNull(),

  updatedAt: timestamp()
    .defaultNow()
    .notNull(),
},(table)=>[
  index("eamilin").on(table.email)]
);

