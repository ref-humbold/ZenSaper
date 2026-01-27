import { Injectable } from "@angular/core";

import { BoardPosition } from "src/app/models/board-position";
import { GameModeService } from "src/app/services/interfaces/game-mode.service";

@Injectable({
  providedIn: "root"
})
export class TrollModeService implements GameModeService {
  public get modeName(): string {
    return "Troll";
  }

  public get playingImage(): string {
    return "assets/trollface.png";
  }

  public get winningImage(): string {
    return "assets/trollface.png";
  }

  public get losingImage(): string {
    return "assets/trollface.png";
  }

  public initialBombs(clicked: BoardPosition): BoardPosition[] {
    return [clicked];
  }
}
