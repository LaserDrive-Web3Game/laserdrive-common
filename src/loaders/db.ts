import { drizzle } from "drizzle-orm/node-postgres";
import { Client } from "pg";
import config from "../config";
import { UserSchema } from "../schema/user";
import { WalletSchema } from "../schema/wallet";
import { GameSessionSchema } from "../schema/game-session";
import { PlayerEntrySchema } from "../schema/player-entry";
import * as schemas from "../schema";

const userSchemaMetadata = {
  name: "userSchema",
  schema: UserSchema,
};

const walletSchemaMetadata = {
  name: "walletSchema",
  schema: WalletSchema,
};

const gameSessionSchemaMetadata = {
  name: "gameSessionSchema",
  schema: GameSessionSchema,
};

const playerEntrySchemaMetadata = {
  name: "playerEntrySchema",
  schema: PlayerEntrySchema,
};

export const DB_SCHEMAS = [userSchemaMetadata, walletSchemaMetadata, gameSessionSchemaMetadata, playerEntrySchemaMetadata]

export const client = new Client({
  connectionString: config.databaseURL,
});

export const db = async () => {
  await client.connect();
  const db = drizzle(client, { schema: { ...schemas } });
  return db;
};
