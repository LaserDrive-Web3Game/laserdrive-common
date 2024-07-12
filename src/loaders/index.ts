import dbLoader from "./db";
import dependencyInjectorLoader from "./dependencyInjector";
import Logger from "./logger";
import { UserSchema } from "../schema/user";
import { WalletSchema } from "../schema/wallet";
import { GameSessionSchema } from "../schema/game-session";
import { PlayerEntrySchema } from "../schema/player-entry";

export default async () => {
  const dbInstance = await dbLoader();
  Logger.info("✌️ DB loaded and connected!");

  const userSchema = {
    name: "userSchema",
    schema: UserSchema,
  };

  const walletSchema = {
    name: "walletSchema",
    schema: WalletSchema,
  };

  const gameSessionSchema = {
    name: "gameSessionSchema",
    schema: GameSessionSchema,
  };

  const playerEntrySchema = {
    name: "playerEntrySchema",
    schema: PlayerEntrySchema,
  };

  await dependencyInjectorLoader(dbInstance, {
    schemas: [userSchema, walletSchema, gameSessionSchema, playerEntrySchema],
  });
  Logger.info("✌️ Dependency Injector loaded");

  Logger.info("✌️ Express loaded");
};
