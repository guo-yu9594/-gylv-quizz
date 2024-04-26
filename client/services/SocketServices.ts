import { ResSelectType } from "@/app/components/Quiz";
import { Difficulty, Settings } from "@/app/components/QuizSettings";
import { NewPlayerData } from "@/types";
import io, { Socket } from "socket.io-client";

export default class SocketServices {
  public socket: Socket;
  public roomId: string = "";
  public userId: string = "";
  public username: string = "You";
  public inRoom: boolean = false;

  constructor() {
    this.socket = io("https://gylv-quiz-client.onrender.com", {
      autoConnect: false,
    });
    this.socket.connect();
  }

  on = (eventName: string, callback: any) => {
    this.socket.on(eventName, callback);
  };

  single = (settings: Settings) => {
    this.socket.emit("create", { username: this.username }, (res: any) => {
      this.roomId = res;
      this.inRoom = true;
      this.start(settings);
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

  start = (settings: Settings) => {
    this.socket.emit(
      "start",
      { settings, roomId: this.roomId },
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
