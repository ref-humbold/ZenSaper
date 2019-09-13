import { Component, OnInit } from "@angular/core";
import { Board } from "../models/board";
import { BoardPosition } from "../models/board-position";
import { FieldStatus } from "../field/field.component";

@Component({
    selector: "app-normal-board",
    templateUrl: "./normal-board.component.html",
    styleUrls: ["./normal-board.component.css"]
})
export class NormalBoardComponent extends Board implements OnInit {
    constructor() {
        super();
    }

    ngOnInit() { }

    protected initalBombs(): BoardPosition[] {
        return [];
    }

    private countDistances(bombs: BoardPosition[]) {
        for (const pos of bombs) {
            this.fields[pos.row][pos.column].createBomb();

            if (pos.row > 0 && pos.column > 0) {
                this.fields[pos.row - 1][pos.column - 1].addNeighbouringBomb();
            }

            if (pos.row > 0) {
                this.fields[pos.row - 1][pos.column].addNeighbouringBomb();
            }

            if (pos.row > 0 && pos.column < Board.SIZE) {
                this.fields[pos.row - 1][pos.column + 1].addNeighbouringBomb();
            }

            if (pos.column > 0) {
                this.fields[pos.row][pos.column - 1].addNeighbouringBomb();
            }

            if (pos.column < Board.SIZE) {
                this.fields[pos.row][pos.column + 1].addNeighbouringBomb();
            }

            if (pos.row < Board.SIZE && pos.column > 0) {
                this.fields[pos.row + 1][pos.column - 1].addNeighbouringBomb();
            }

            if (pos.row < Board.SIZE) {
                this.fields[pos.row + 1][pos.column].addNeighbouringBomb();
            }

            if (pos.row < Board.SIZE && pos.column < Board.SIZE) {
                this.fields[pos.row + 1][pos.column + 1].addNeighbouringBomb();
            }
        }
    }

    private bfs(startPos: BoardPosition) {
        const queue: BoardPosition[] = [startPos];

        this.fields[startPos.row][startPos.column].status = FieldStatus.Visible;

        while (queue.length > 0) {
            const pos: BoardPosition = queue.shift();

            if (this.fields[pos.row][pos.column].isEmpty) {
                if (pos.row > 0 && pos.column > 0
                    && this.fields[pos.row - 1][pos.column - 1].status === FieldStatus.Hidden) {
                    this.fields[pos.row - 1][pos.column - 1].status = FieldStatus.Visible;

                    if (!this.fields[pos.row - 1][pos.column - 1].hasBomb) {
                        queue.push(new BoardPosition(pos.row - 1, pos.column - 1));
                    }
                }

                if (pos.row > 0
                    && this.fields[pos.row - 1][pos.column].status === FieldStatus.Hidden) {
                    this.fields[pos.row - 1][pos.column].status = FieldStatus.Visible;

                    if (!this.fields[pos.row - 1][pos.column].hasBomb) {
                        queue.push(new BoardPosition(pos.row - 1, pos.column));
                    }
                }

                if (pos.row > 0 && pos.column < Board.SIZE - 1
                    && this.fields[pos.row - 1][pos.column + 1].status === FieldStatus.Hidden) {
                    this.fields[pos.row - 1][pos.column + 1].status = FieldStatus.Visible;

                    if (!this.fields[pos.row - 1][pos.column + 1].hasBomb) {
                        queue.push(new BoardPosition(pos.row - 1, pos.column + 1));
                    }
                }

                if (pos.column > 0
                    && this.fields[pos.row][pos.column - 1].status === FieldStatus.Hidden) {
                    this.fields[pos.row][pos.column - 1].status = FieldStatus.Visible;

                    if (!this.fields[pos.row][pos.column - 1].hasBomb) {
                        queue.push(new BoardPosition(pos.row, pos.column - 1));
                    }
                }

                if (pos.column < Board.SIZE - 1
                    && this.fields[pos.row][pos.column + 1].status === FieldStatus.Hidden) {
                    this.fields[pos.row][pos.column + 1].status = FieldStatus.Visible;

                    if (!this.fields[pos.row][pos.column + 1].hasBomb) {
                        queue.push(new BoardPosition(pos.row, pos.column + 1));
                    }
                }

                if (pos.row < Board.SIZE - 1 && pos.column > 0
                    && this.fields[pos.row + 1][pos.column - 1].status === FieldStatus.Hidden) {
                    this.fields[pos.row + 1][pos.column - 1].status = FieldStatus.Visible;

                    if (!this.fields[pos.row + 1][pos.column - 1].hasBomb) {
                        queue.push(new BoardPosition(pos.row + 1, pos.column - 1));
                    }
                }

                if (pos.row < Board.SIZE - 1
                    && this.fields[pos.row + 1][pos.column].status === FieldStatus.Hidden) {
                    this.fields[pos.row + 1][pos.column].status = FieldStatus.Visible;

                    if (!this.fields[pos.row + 1][pos.column].hasBomb) {
                        queue.push(new BoardPosition(pos.row + 1, pos.column));
                    }
                }

                if (pos.row < Board.SIZE - 1 && pos.column < Board.SIZE - 1
                    && this.fields[pos.row + 1][pos.column + 1].status === FieldStatus.Hidden) {
                    this.fields[pos.row + 1][pos.column + 1].status = FieldStatus.Visible;

                    if (!this.fields[pos.row + 1][pos.column + 1].hasBomb) {
                        queue.push(new BoardPosition(pos.row + 1, pos.column + 1));
                    }
                }
            }
        }
    }
}
