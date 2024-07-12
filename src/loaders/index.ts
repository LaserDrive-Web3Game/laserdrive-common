import dbLoader from "./db";
import dependencyInjectorLoader from "./dependencyInjector";
import Logger from "./logger";
import { UserSchema } from "../schema/user";

export default async () => {
  const dbInstance = await dbLoader();
  Logger.info("✌️ DB loaded and connected!");

  const userSchema = {
    name: "userSchema",
    schema: UserSchema,
  };

  await dependencyInjectorLoader(dbInstance, {
    schemas: [userSchema],
  });
  Logger.info("✌️ Dependency Injector loaded");

  Logger.info("✌️ Express loaded");
};
