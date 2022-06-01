import { Injectable } from "@angular/core";

import { BoardPosition } from "src/app/models/board-position";
import { GameMode } from "src/app/services/interfaces/game-mode";

@Injectable({
  providedIn: "root"
})
export class NormalModeService implements GameMode {
  public get modeName(): string {
    return "Normal";
  }

  public get playingImage(): string {
    return "/assets/epicface.jpg";
  }

  public get winningImage(): string {
    return "assets/winface.jpg";
  }

  public get losingImage(): string {
    return "assets/sadface.jpg";
  }

  public initialBombs(): BoardPosition[] {
    return [];
  }
}
