import { BoardPosition } from "./board-position";
import { FieldComponent } from "../field/field.component";

export abstract class Board {
    public static readonly SIZE = 16;
    public fields: FieldComponent[][];

    constructor() { }

    public generateBombs(count: number, posClicked: BoardPosition): BoardPosition[] {
        const bombs: BoardPosition[] = this.initalBombs();

        count -= bombs.length;

        for (let i = 0; i < count; ++i) {
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

    public abstract onLeftClickField(): void;

    public abstract onRightClickField(): void;

    protected abstract initalBombs(): BoardPosition[];
}
