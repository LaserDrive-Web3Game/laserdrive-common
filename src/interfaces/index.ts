export interface IGameSession {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  status: string;
  finalMultiplier: string | number;
}
