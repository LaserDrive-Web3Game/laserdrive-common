import { Container } from "typedi";
import LoggerInstance from "./logger";

export default async (dbInstance: DB.Schemas, { schemas }: { schemas: { name: string; schema: any }[] }): Promise<void> => {
  try {
    schemas.forEach(m => {
      Container.set(m.name, m.schema);
    });


    Container.set("logger", LoggerInstance);
    Container.set("db", dbInstance);
  } catch (e) {
    LoggerInstance.error("🔥 Error on dependency injector loader: %o", e);
    throw e;
  }
};
