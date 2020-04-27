import { Injectable } from "@angular/core";
import { GameMode } from "./game-mode";
import { BoardPosition } from "../models/board-position";

@Injectable({
    providedIn: "root"
})
export class TrollModeService implements GameMode {

    constructor() { }

    public initialBombs(posClicked: BoardPosition): BoardPosition[] {
        return [posClicked];
    }

    public getPlayingImage(): string {
        return "../../../assets/trollface.jpg";
    }

    public getWinningImage(): string {
        return "../../../assets/trollface.jpg";
    }

    public getLosingImage(): string {
        return "../../../assets/trollface.jpg";
    }
}
