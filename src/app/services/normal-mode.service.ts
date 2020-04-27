import { Injectable } from "@angular/core";
import { GameMode } from "./game-mode";
import { BoardPosition } from "../models/board-position";

@Injectable({
    providedIn: "root"
})
export class NormalModeService implements GameMode {

    constructor() { }

    public initialBombs(posClicked: BoardPosition): BoardPosition[] {
        return [];
    }

    public getPlayingImage(): string {
        return "../../../assets/epicface.jpg";
    }

    public getWinningImage(): string {
        return "../../../assets/winface.jpg";
    }

    public getLosingImage(): string {
        return "../../../assets/sadface.jpg";
    }
}
