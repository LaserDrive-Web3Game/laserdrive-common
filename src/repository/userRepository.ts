import { eq } from 'drizzle-orm';
import jwt, { SignOptions, Algorithm } from 'jsonwebtoken';
import { generateNonce } from '../utils';
import { IUser, IWallet } from '../interfaces';
import { JWT_SECRET } from '../config/constants';

const jwtAlgorithm: Algorithm = 'HS256';

export class UserRepository {
  constructor(
    private db: DB.Schemas,
    private userSchema: Schemas.UserSchema,
    private walletSchema: Schemas.WalletSchema,
  ) {}

  async getOrCreateNonce(address: string) {
    const queryResp = await this.db.select().from(this.userSchema).where(eq(this.userSchema.address, address));

    if (queryResp.length > 0) return queryResp[0].nonce;
    const newQueryResp = await this.db
      .insert(this.userSchema)
      .values({ address: address })
      .returning({ newNonce: this.userSchema.nonce });
    return newQueryResp[0].newNonce;
  }

  public async getUserByAddress(address: string): Promise<IUser> {
    const queryset = await this.db.select().from(this.userSchema).where(eq(this.userSchema.address, address));

    if (queryset.length < 1) return null;

    return queryset[0] as IUser;
  }

  public async getUserByID(id: number): Promise<IUser> {
    const queryset = await this.db.select().from(this.userSchema).where(eq(this.userSchema.id, id));

    if (queryset.length < 1) return null;

    return queryset[0] as IUser;
  }

  public async updateUserNonce(id: number): Promise<void> {
    const newNonce = generateNonce();
    await this.db.update(this.userSchema).set({ nonce: newNonce }).where(eq(this.userSchema.id, id));
  }

  public async getUserWalletByUserId(userId: number): Promise<IWallet> {
    const queryset = await this.db.select().from(this.walletSchema).where(eq(this.walletSchema.user, userId));

    if (queryset.length < 1) return null;

    return queryset[0] as IWallet;
  }

  async createUserWallet(userId: number): Promise<IWallet> {
    const resp = await this.db
      .insert(this.walletSchema)
      .values({ user: userId })
      .returning({ id: this.walletSchema.id, user: this.walletSchema.user, balance: this.walletSchema.balance });
    return resp[0] as IWallet;
  }

  public createJWT(user: IUser) {
    const today = new Date();
    const exp = new Date(today);
    exp.setDate(today.getDate() + 60);

    const options: SignOptions = {
      algorithm: jwtAlgorithm,
    };

    return jwt.sign(
      {
        id: user.id,
        address: user.address,
        exp: exp.getTime() / 1000,
      },
      JWT_SECRET,
      options,
    );
  }
}
