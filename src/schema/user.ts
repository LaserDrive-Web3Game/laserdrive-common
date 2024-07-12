import { generateNonce } from "../utils";
import {
  serial,
  char,
  uniqueIndex,
  timestamp,
  pgTable,
} from "drizzle-orm/pg-core";

export const UserSchema = pgTable(
  "users",
  {
    id: serial("id").primaryKey(),
    address: char("address", { length: 300 }).notNull(),
    nonce: char("nonce", { length: 50 }).$default(() => generateNonce()),

    createdAt: timestamp("created_at").$default(() => new Date()),
    updatedAt: timestamp("updated_at", {
      mode: "date",
      precision: 3,
    }).$onUpdate(() => new Date()),
  },
  (table) => {
    return {
      addressIdx: uniqueIndex("address_idx").on(table.address),
    };
  }
);

export type UserSchemaType = typeof UserSchema;
