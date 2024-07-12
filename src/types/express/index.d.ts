import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import {IUser} from '../../interfaces/IUser';
import { UserSchema } from "../../schema/user";

declare global {

  namespace DB {
    export type Schemas = NodePgDatabase<{
      UserSchema: typeof UserSchema;
    }>
  }

  namespace Schemas {
    export type UserSchema = typeof UserSchema;
  }
}
