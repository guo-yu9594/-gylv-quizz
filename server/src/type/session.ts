export type Users = {
  [id: string]: {
    username: string;
    roomId: string;
    inTest: boolean;
  };
};

export type Rooms = { [roomId: string]: Users };

export type Answers = { [roomId: string]: number[] };