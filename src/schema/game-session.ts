import { serial, decimal, pgEnum, timestamp, pgTable } from 'drizzle-orm/pg-core';

export const gameStatusEnum = pgEnum('gameStatus', ['active', 'done']);

export const GameSessionSchema = pgTable('game_session', {
  id: serial('id').primaryKey(),
  status: gameStatusEnum('game_status').default('active'),
  finalMultiplier: decimal('final_multiplier', { precision: 10, scale: 2 }),

  createdAt: timestamp('created_at').$default(() => new Date()),
  updatedAt: timestamp('updated_at', {
    mode: 'date',
    precision: 3,
  }).$onUpdate(() => new Date()),
});

export type GameSessionSchemaType = typeof GameSessionSchema;
