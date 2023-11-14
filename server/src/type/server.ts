import { CreateData, CTSEndData, JoinData, NewPlayerData, STCStartData } from "./data";

export type ServerToClientEvents = {
  noArg: () => void;
  basicEmit: (a: number, b: string, c: Buffer) => void;
  withAck: (d: string, callback: (e: number) => void) => void;
  newPlayer: (data: NewPlayerData) => void;
  start: (data: STCStartData) => void;
};

export type ClientToServerEvents = {
  hello: () => void;
  join: (data: JoinData, callback: any) => void;
  create: (data: CreateData, callback: any) => void;
  start: () => void;
  end: (data: CTSEndData) => void;
};

export type InterServerEvents = {
  ping: () => void;
};

export type SocketData = {
  name: string;
  age: number;
};