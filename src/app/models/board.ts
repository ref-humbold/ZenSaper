import { Subscription } from "rxjs";
import { BoardPosition } from "./board-position";
import { FieldComponent, FieldStatus } from "../components/field/field.component";
import { TickerService } from "../services/ticker.service";

export abstract class Board {
    public static readonly SIZE: number = 16;
    public static readonly MAX_FLAGS: number = 40;
    public fieldsGrid: FieldComponent[][];
    public flagsLeft: number = Board.MAX_FLAGS;
    public seconds: number = 0;
    protected secondsTicker: Subscription;

    constructor(private ticker: TickerService) { }

    public generateBombs(count: number, posClicked: BoardPosition): BoardPosition[] {
        const bombs: BoardPosition[] = this.initialBombs();

        count -= bombs.length;

        for (let i: number = 0; i < count; ++i) {
            let pos: BoardPosition;

            do {
                pos = new BoardPosition(
                    Math.floor(Math.random() * Board.SIZE),
                    Math.floor(Math.random() * Board.SIZE)
                );
            } while (bombs.indexOf(pos) >= 0 || posClicked.isNeighbour(pos));

            bombs.push(pos);
        }

        return bombs;
    }

    public onNewGame(): void {
        this.flagsLeft = Board.MAX_FLAGS;
        this.seconds = 0;
        this.fieldsGrid.forEach(rw => rw.forEach(fd => fd.clear()));
        this.secondsTicker = this.ticker.create(() => ++this.seconds);
    }

    public onEndGame(): void {
        this.secondsTicker.unsubscribe();
    }

    public abstract onLeftClickField(pos: BoardPosition): void;

    public abstract onRightClickField(pos: BoardPosition): void;

    protected abstract initialBombs(): BoardPosition[];
}
