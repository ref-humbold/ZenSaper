import { Subscription } from "rxjs";
import { BoardPosition } from "./board-position";
import { FieldComponent } from "../components/field/field.component";
import { TickerService } from "../services/ticker.service";

export enum GameState {
    New, Played, Finished
}

export abstract class Board {
    public static readonly SIZE: number = 16;
    public static readonly BOMBS_COUNT: number = 36;
    public fieldsGrid: FieldComponent[][];
    public flagsLeft: number = Board.BOMBS_COUNT;
    public seconds: number = 0;
    protected secondsTicker: Subscription;
    protected state: GameState = GameState.New;

    constructor(private ticker: TickerService) { }

    public generateBombs(posClicked: BoardPosition): BoardPosition[] {
        const bombs: BoardPosition[] = this.initialBombs(posClicked);

        while (bombs.length < Board.BOMBS_COUNT) {
            let pos: BoardPosition;

            do {
                pos = new BoardPosition(
                    Math.floor(Math.random() * Board.SIZE),
                    Math.floor(Math.random() * Board.SIZE)
                );
            } while (bombs.findIndex(p => p.equals(pos)) >= 0 || posClicked.isNeighbour(pos));

            bombs.push(pos);
        }

        return bombs;
    }

    public startNewGame(): void {
        this.state = GameState.New;
        this.flagsLeft = Board.BOMBS_COUNT;
        this.seconds = 0;
        this.fieldsGrid.forEach(rw => rw.forEach(fd => fd.clear()));
        this.secondsTicker = this.ticker.create(() => ++this.seconds);
    }

    public finishGame(): void {
        this.state = GameState.Finished;
        this.secondsTicker.unsubscribe();
    }

    public abstract onLeftClickField(pos: BoardPosition): void;

    public abstract onRightClickField(pos: BoardPosition): void;

    protected abstract initialBombs(posClicked: BoardPosition): BoardPosition[];
}
