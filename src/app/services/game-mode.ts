import { BoardPosition } from "../models/board-position";

export interface GameMode {
    initialBombs(posClicked: BoardPosition): BoardPosition[];

    getPlayingImage(): string;

    getWinningImage(): string;

    getLosingImage(): string;
}
