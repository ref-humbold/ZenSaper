import { BoardPosition } from "./board-position";
import { FieldComponent } from "../components/field/field.component";

export abstract class Board {
    public static readonly SIZE: number = 16;
    public fieldsGrid: FieldComponent[][];

    constructor() { }

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

    public abstract onLeftClickField(pos: BoardPosition): void;

    public abstract onRightClickField(pos: BoardPosition): void;

    protected abstract initialBombs(): BoardPosition[];
}