import { Component, OnInit } from "@angular/core";
import { FieldComponent } from "../field/field.component";
import { BoardPosition } from "../models/board-position";

@Component({
    selector: "app-board",
    templateUrl: "./board.component.html",
    styleUrls: ["./board.component.css"]
})
export class BoardComponent implements OnInit {
    private static readonly SIZE = 16;
    public fields: FieldComponent[][];

    constructor() {
        this.fields = new Array(BoardComponent.SIZE)
            .fill(null)
            .map(() => new Array(BoardComponent.SIZE).fill(null));
    }

    ngOnInit() {}

    private countDistances(bombs: BoardPosition[]) {
        for (const pos of bombs) {
            this.fields[pos.row][pos.column].createBomb();

            if (pos.row > 0 && pos.column > 0) {
                this.fields[pos.row - 1][pos.column - 1].addNeighbouringBomb();
            }

            if (pos.row > 0) {
                this.fields[pos.row - 1][pos.column].addNeighbouringBomb();
            }

            if (pos.row > 0 && pos.column < BoardComponent.SIZE) {
                this.fields[pos.row - 1][pos.column + 1].addNeighbouringBomb();
            }

            if (pos.column > 0) {
                this.fields[pos.row][pos.column - 1].addNeighbouringBomb();
            }

            if (pos.column < BoardComponent.SIZE) {
                this.fields[pos.row][pos.column + 1].addNeighbouringBomb();
            }

            if (pos.row < BoardComponent.SIZE && pos.column > 0) {
                this.fields[pos.row + 1][pos.column - 1].addNeighbouringBomb();
            }

            if (pos.row < BoardComponent.SIZE) {
                this.fields[pos.row + 1][pos.column].addNeighbouringBomb();
            }

            if (pos.row < BoardComponent.SIZE && pos.column < BoardComponent.SIZE) {
                this.fields[pos.row + 1][pos.column + 1].addNeighbouringBomb();
            }
        }
    }

    private generateBombs(
        count: number,
        posClicked: BoardPosition,
        isOnClicked: boolean
    ): BoardPosition[] {
        const bombs: BoardPosition[] = isOnClicked ? [posClicked] : [];

        for (let i = 0; i < count; ++i) {
            let pos: BoardPosition;

            do {
                pos = new BoardPosition(
                    Math.floor(Math.random() * BoardComponent.SIZE),
                    Math.floor(Math.random() * BoardComponent.SIZE)
                );
            } while (bombs.indexOf(pos) >= 0 || posClicked.isNeighbour(pos));

            bombs.push(pos);
        }

        return bombs;
    }
}
