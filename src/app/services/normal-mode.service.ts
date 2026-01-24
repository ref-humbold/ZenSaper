import { Injectable } from "@angular/core";

import { BoardPosition } from "src/app/models/board-position";
import { GameModeService } from "src/app/services/interfaces/game-mode.service";

@Injectable({
  providedIn: "root"
})
export class NormalModeService implements GameModeService {
  public get modeName(): string {
    return "Normal";
  }

  public get playingImage(): string {
    return "assets/epicface.png";
  }

  public get winningImage(): string {
    return "assets/winface.png";
  }

  public get losingImage(): string {
    return "assets/sadface.png";
  }

  public initialBombs(): BoardPosition[] {
    return [];
  }
}
