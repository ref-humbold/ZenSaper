import { BoardPosition } from "src/app/models/board-position";

export interface GameModeService {
  get modeName(): string;
  get playingImage(): string;
  get winningImage(): string;
  get losingImage(): string;

  initialBombs(clicked: BoardPosition): BoardPosition[];
}
