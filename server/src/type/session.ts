export type Users = {
  [id: string]: {
    username: string;
    roomId: string;
  };
};

export type Rooms = { [roomId: string]: Users };
