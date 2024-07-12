import { serial, integer, decimal, pgEnum, timestamp, pgTable } from 'drizzle-orm/pg-core';
import { GameSessionSchema } from './game-session';
import { UserSchema } from './user';

export const entryStatusEnum = pgEnum('entryStatus', ['active', 'lost', 'won'])

export const PlayerEntrySchema = pgTable('player_entry', {
  id: serial('id').primaryKey(),
  user: integer('user').references(() => UserSchema.id),
  gameSession: integer('game_session').references(() => GameSessionSchema.id),
  amount: decimal('amount', {precision: 50, scale: 0}),
  status: entryStatusEnum('status').default('active'),
  exitPoint: decimal('exit_point', { precision: 10, scale: 2 }),

  createdAt: timestamp('created_at').$default(() => new Date()),
  updatedAt: timestamp('updated_at', {
    mode: 'date',
    precision: 3,
  }).$onUpdate(() => new Date()),
});

export type PlayerEntrySchemaType = typeof PlayerEntrySchema;
