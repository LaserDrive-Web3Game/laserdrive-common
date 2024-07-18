export interface IGameSession {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  status: string;
  finalMultiplier: string | number;
}

export interface IUser {
  id: number;
  address: string;
  nonce: string;

  createdAt: Date;
  updatedAt: Date;
}

export interface IWallet {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  user: number;
  balance: string;
}

export interface IPlayerEntry {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  status: string;
  user: number;
  gameSession: number;
  amount: string;
  exitPoint: string;
}
