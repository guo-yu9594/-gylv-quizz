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
  response: number[];
};

export type STCEndData = {
  answers: number[];
  results?: {
    rank: number;
    grade: number;
    ranking: {
      rank: number;
      username: string;
      grade: number;
    }[];
  };
};

export type STCStartData = {
  questions: any;
};
