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
  subject: string;
  roomId: string;
};

export type CTSEndData = {
  roomId: string;
  userId: string;
  response: number[];
};

export type STCEndData = {
  answers: number[];
};

export type STCStartData = {
  questions: any;
};
