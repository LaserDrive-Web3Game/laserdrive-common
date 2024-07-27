import { generateNonce } from "../utils";
import {
  serial,
  uniqueIndex,
  timestamp,
  pgTable,
  text,
} from "drizzle-orm/pg-core";

export const UserSchema = pgTable(
  "users",
  {
    id: serial("id").primaryKey(),
    address: text("address").notNull(),
    nonce: text("nonce").$default(() => generateNonce()),

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
