import { Result, Settings } from "./session";

export type JoinData = {
  username: string;
  roomId: string;
};

export type CreateData = {
  username: string;
};

export type NewPlayerData = {
  id: string;
  username: string;
};

export type CTSStartData = {
  settings: Settings;
  roomId: string;
};

export type CTSEndData = {
  answers: number[];
};

export type STCEndData = {
  answers: number[];
  results?: Result[];
};

export type STCStartData = {
  questions: any;
};
