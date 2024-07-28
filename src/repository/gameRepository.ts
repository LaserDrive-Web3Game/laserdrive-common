import { eq, and, lt, or, sql } from 'drizzle-orm';
import BigNumber from 'bignumber.js';

const ACTIVE_GAME_STATE = 'active';
const PREPARING_GAME_STATE = 'preparing';
const DONE_GAME_STATE = 'done';

const PLAYER_STATE_LOST = 'lost';
const PLAYER_STATE_ACTIVE = 'active';
const PLAYER_STATE_WON = 'won';

export class GameRepository {
  private db: DB.Schemas;
  private gameSessionSchema: Schemas.GameSessionSchema;
  private playerEntrySchema: Schemas.PlayerEntrySchema;
  private walletSchema: Schemas.WalletSchema;

  constructor(
    db: DB.Schemas,
    gameSessionSchema: Schemas.GameSessionSchema,
    playerEntrySchema: Schemas.PlayerEntrySchema,
    walletSchema: Schemas.WalletSchema,
  ) {
    this.db = db;
    this.gameSessionSchema = gameSessionSchema;
    this.playerEntrySchema = playerEntrySchema;
    this.walletSchema = walletSchema;
  }

  async getOrCreateGameSession() {
    const queryResp = await this.db
      .select()
      .from(this.gameSessionSchema)
      .where(
        or(
          eq(this.gameSessionSchema.status, ACTIVE_GAME_STATE),
          eq(this.gameSessionSchema.status, PREPARING_GAME_STATE),
        ),
      );

    if (queryResp.length > 0) return queryResp[0];
    const newQueryResp = await this.db.insert(this.gameSessionSchema).values({}).returning({
      id: this.gameSessionSchema.id,
      status: this.gameSessionSchema.status,
      finalMultiplier: this.gameSessionSchema.finalMultiplier,
      createdAt: this.gameSessionSchema.createdAt,
      updatedAt: this.gameSessionSchema.updatedAt,
    });
    return newQueryResp[0];
  }

  async startGameSession() {
    await this.db
      .update(this.gameSessionSchema)
      .set({ status: ACTIVE_GAME_STATE })
      .where(eq(this.gameSessionSchema.status, PREPARING_GAME_STATE));
  }

  async getOpenGameSession() {
    const queryResp = await this.db
      .select()
      .from(this.gameSessionSchema)
      .where(eq(this.gameSessionSchema.status, PREPARING_GAME_STATE));

    if (queryResp.length > 0) return queryResp[0];
  }

  async endGameSession(finalMultiplier: string) {
    await this.db.transaction(async tx => {
      const game = await tx
        .update(this.gameSessionSchema)
        .set({ status: DONE_GAME_STATE, finalMultiplier: finalMultiplier })
        .where(eq(this.gameSessionSchema.status, ACTIVE_GAME_STATE))
        .returning({ id: this.gameSessionSchema.id });

      await tx
        .update(this.playerEntrySchema)
        .set({ status: PLAYER_STATE_LOST })
        .where(
          and(
            eq(this.playerEntrySchema.gameSession, game[0].id),
            eq(this.playerEntrySchema.status, PLAYER_STATE_ACTIVE),
          ),
        );
    });
  }

  async createUserEntry(gameSessionId: number, userId: number, amount: BigNumber) {
    return await this.db.transaction(async tx => {
      const [wallet] = await tx
        .select({ balance: this.walletSchema.balance })
        .from(this.walletSchema)
        .where(eq(this.walletSchema.user, userId));

      if (Number(wallet.balance) < Number(amount.toFixed())) {
        await tx.rollback();
        return;
      }

      await tx
        .update(this.walletSchema)
        .set({ balance: sql`${this.walletSchema.balance} - ${Number(amount.toFixed())}` })
        .where(eq(this.walletSchema.user, userId));

      const gameEntry = await tx
        .insert(this.playerEntrySchema)
        .values({
          user: userId,
          gameSession: gameSessionId,
          amount: amount.toFixed(),
        })
        .returning({
          id: this.gameSessionSchema.id,
          user: this.playerEntrySchema.user,
          gameSession: this.playerEntrySchema.gameSession,
          amount: this.playerEntrySchema.amount,
          status: this.playerEntrySchema.status,
          exitPoint: this.playerEntrySchema.exitPoint,
          createdAt: this.playerEntrySchema.createdAt,
          updatedAt: this.playerEntrySchema.updatedAt,
        });

      return gameEntry;
    });
  }

  async cancelPlayerEntry(playerEntryId: number) {
    await this.db
      .update(this.playerEntrySchema)
      .set({ status: PLAYER_STATE_LOST })
      .where(eq(this.playerEntrySchema.id, playerEntryId));
  }

  async getOpenPlayerEntry(playerEntryId: number, userId: number) {
    const [queryResp] = await this.db
      .select()
      .from(this.playerEntrySchema)
      .where(
        and(
          eq(this.playerEntrySchema.id, playerEntryId),
          eq(this.playerEntrySchema.user, userId),
          eq(this.playerEntrySchema.status, PLAYER_STATE_ACTIVE),
        ),
      );

    return queryResp;
  }

  async cashOut(playerEntryId: number, currentMultiplier: number) {
    return await this.db.transaction(async tx => {
      const [entry] = await tx
        .update(this.playerEntrySchema)
        .set({ exitPoint: currentMultiplier.toString(), status: PLAYER_STATE_WON })
        .where(eq(this.playerEntrySchema.id, playerEntryId))
        .returning({
          id: this.gameSessionSchema.id,
          user: this.playerEntrySchema.user,
          amount: this.playerEntrySchema.amount,
        });

      if (!entry) {
        await tx.rollback();
        return;
      }

      const reward = new BigNumber(entry.amount).multipliedBy(currentMultiplier);
      const [wallet] = await tx
        .update(this.walletSchema)
        .set({ balance: sql`${this.walletSchema.balance} + ${Number(reward.toFixed())}` })
        .returning({ balance: this.walletSchema.balance });

      return wallet.balance;
    });
  }
}
