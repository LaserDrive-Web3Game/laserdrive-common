import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import { UserSchema, PlayerEntrySchema, GameSessionSchema, WalletSchema } from '../schema';

declare global {
  namespace DB {
    export type Schemas = NodePgDatabase<{
      UserSchema: typeof UserSchema;
      GameSessionSchema: typeof GameSessionSchema;
      WalletSchema: typeof WalletSchema;
      PlayerEntrySchema: typeof PlayerEntrySchema;
    }>
  }

  namespace Schemas {
    export type UserSchema = typeof UserSchema;
    export type GameSessionSchema = typeof GameSessionSchema;
    export type WalletSchema = typeof WalletSchema;
    export type PlayerEntrySchema = typeof PlayerEntrySchema;
  }
}

export enum GAS_PRICE {
  default = "5",
  fast = "6",
  instant = "7",
  testnet = "10",
}

export interface Address {
  97: string;
  56: string;
}

export enum ChainId {
  MAINNET = 56,
  TESTNET = 97,
}
