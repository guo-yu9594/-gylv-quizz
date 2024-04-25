import { ResSelectType } from "@/app/components/Quiz";
import io, { Socket } from "socket.io-client";

export default class SocketServices {
  public socket: Socket;
  public roomId: string = "";
  public userId: string = "";
  public username: string = "You";

  constructor() {
    this.socket = io("http://localhost:3001", {
      autoConnect: false,
    });
    this.socket.connect();
  }

  on = (eventName: string, callback: any) => {
    this.socket.on(eventName, callback);
  };

  single = () => {
    this.socket.emit("create", { username: this.username }, (res: any) => {
      this.roomId = res;
      this.start();
    });
  };

  create = () => {
    this.socket.emit("create", { username: this.username }, (res: any) => {
      console.log("roomId: ", res);
      this.roomId = res;
    });
  };

  join = (roomId: string) => {
    this.socket.emit(
      "join",
      { username: this.username, roomId: roomId },
      (res: any) => {
        console.log(res);
        this.roomId = roomId;
      }
    );
  };

  start = () => {
    this.socket.emit(
      "start",
      { subject: "technologie", roomId: this.roomId },
      (res: any) => {
        console.log(res);
      }
    );
  };

  end = (answers: number[]) => {
    console.log(this.userId);

    this.socket.emit("end", { answers: answers }, (res: any) => {
      console.log(res);
    });
  };
}
