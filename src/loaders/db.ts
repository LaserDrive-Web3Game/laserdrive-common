import { drizzle } from "drizzle-orm/node-postgres";
import { Client } from "pg";
import config from "../config";
import * as schemas from "../schema";

export const client = new Client({
  connectionString: config.databaseURL,
});

export default async () => {
  await client.connect();
  const db = drizzle(client, { schema: { ...schemas } });
  return db;
};
