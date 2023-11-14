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

export type CTSEndData = {
  responses: number[];
};

export type STCStartData = {
  roomId: string;
  questions: { question: string; options: string[] }[];
};
