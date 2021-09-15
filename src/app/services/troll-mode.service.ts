import { Injectable } from "@angular/core";
import { GameMode } from "../models/game-mode";
import { BoardPosition } from "../models/board-position";

@Injectable({
  providedIn: "root"
})
export class TrollModeService implements GameMode {
  public get modeName(): string {
    return "Troll";
  }

  public get playingImage(): string {
    return "../../../assets/trollface.jpg";
  }

  public get winningImage(): string {
    return "../../../assets/trollface.jpg";
  }

  public get losingImage(): string {
    return "../../../assets/trollface.jpg";
  }

  public initialBombs(posClicked: BoardPosition): BoardPosition[] {
    return [posClicked];
  }
}
