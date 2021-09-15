import { BoardPosition } from "./board-position";

export interface GameMode {
  get modeName(): string;
  get playingImage(): string;
  get winningImage(): string;
  get losingImage(): string;

  initialBombs(posClicked: BoardPosition): BoardPosition[];
}
