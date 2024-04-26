import { ResSelectType } from "@/app/components/Quiz";
import { NewPlayerData } from "@/types";
import io, { Socket } from "socket.io-client";

export default class SocketServices {
  public socket: Socket;
  public roomId: string = "";
  public userId: string = "";
  public username: string = "You";
  public inRoom: boolean = false;

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
      this.inRoom = true;
      this.start();
    });
  };

  create = (callback: (value: boolean) => void) => {
    this.socket.emit("create", { username: this.username }, (res: any) => {
      console.log("roomId: ", res);
      this.roomId = res;
      this.inRoom = true;
      callback(true);
    });
  };

  join = async (roomId: string, callback: (value: any[] | null) => void) => {
    this.socket.emit(
      "join",
      { username: this.username, roomId: roomId },
      (res: any) => {
        if (typeof res == "string" && res == "error") {
          this.inRoom = false;
          callback(null);
        } else {
          this.inRoom = true;
          this.roomId = roomId;
          callback(res);
        }
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
