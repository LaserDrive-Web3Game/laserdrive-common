import { serial, decimal, integer, timestamp, pgTable } from 'drizzle-orm/pg-core';
import { UserSchema } from './user';

export const WalletSchema = pgTable('wallets', {
  id: serial('id').primaryKey(),
  user: integer('user')
    .unique()
    .notNull()
    .references(() => UserSchema.id),
  balance: decimal('balance', { precision: 50, scale: 0 }).default('0.00'),

  createdAt: timestamp('created_at').$default(() => new Date()),
  updatedAt: timestamp('updated_at', {
    mode: 'date',
    precision: 3,
  }).$onUpdate(() => new Date()),
});

export type WalletSchemaType = typeof WalletSchema;
