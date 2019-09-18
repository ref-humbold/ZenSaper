import { Component, OnInit, ViewChildren, QueryList } from "@angular/core";
import { Board } from "../../models/board";
import { BoardPosition } from "../../models/board-position";
import { FieldStatus, FieldComponent } from "../field/field.component";

@Component({
    selector: "app-normal-board",
    templateUrl: "./normal-board.component.html",
    styleUrls: ["./normal-board.component.css"]
})
export class NormalBoardComponent extends Board implements OnInit {
    @ViewChildren("fld") public fieldsList: QueryList<FieldComponent>;

    constructor() {
        super();
    }

    ngOnInit() { }

    public onLeftClickField(): void { }

    public onRightClickField(): void { }

    protected initialBombs(): BoardPosition[] {
        return [];
    }

    private fieldsListToGrid(): void {
        this.fieldsGrid = this.fieldsList.reduce(
            (acc, fd) => {
                acc[fd.position.row][fd.position.column] = fd;

                return acc;
            },
            new Array<FieldComponent[]>(Board.SIZE).fill(
                new Array<FieldComponent>(Board.SIZE).fill(null)
            )
        );
    }

    private countDistances(bombs: BoardPosition[]): void {
        for (const pos of bombs) {
            this.fieldsGrid[pos.row][pos.column].createBomb();

            if (pos.row > 0 && pos.column > 0) {
                this.fieldsGrid[pos.row - 1][pos.column - 1].addNeighbouringBomb();
            }

            if (pos.row > 0) {
                this.fieldsGrid[pos.row - 1][pos.column].addNeighbouringBomb();
            }

            if (pos.row > 0 && pos.column < Board.SIZE) {
                this.fieldsGrid[pos.row - 1][pos.column + 1].addNeighbouringBomb();
            }

            if (pos.column > 0) {
                this.fieldsGrid[pos.row][pos.column - 1].addNeighbouringBomb();
            }

            if (pos.column < Board.SIZE) {
                this.fieldsGrid[pos.row][pos.column + 1].addNeighbouringBomb();
            }

            if (pos.row < Board.SIZE && pos.column > 0) {
                this.fieldsGrid[pos.row + 1][pos.column - 1].addNeighbouringBomb();
            }

            if (pos.row < Board.SIZE) {
                this.fieldsGrid[pos.row + 1][pos.column].addNeighbouringBomb();
            }

            if (pos.row < Board.SIZE && pos.column < Board.SIZE) {
                this.fieldsGrid[pos.row + 1][pos.column + 1].addNeighbouringBomb();
            }
        }
    }

    private bfs(startPos: BoardPosition): void {
        const queue: BoardPosition[] = [startPos];

        this.fieldsGrid[startPos.row][startPos.column].status = FieldStatus.Visible;

        while (queue.length > 0) {
            const pos: BoardPosition = queue.shift();

            if (this.fieldsGrid[pos.row][pos.column].isEmpty) {
                if (pos.row > 0 && pos.column > 0
                    && this.fieldsGrid[pos.row - 1][pos.column - 1].status === FieldStatus.Hidden) {
                    this.fieldsGrid[pos.row - 1][pos.column - 1].status = FieldStatus.Visible;

                    if (!this.fieldsGrid[pos.row - 1][pos.column - 1].hasBomb) {
                        queue.push(new BoardPosition(pos.row - 1, pos.column - 1));
                    }
                }

                if (pos.row > 0
                    && this.fieldsGrid[pos.row - 1][pos.column].status === FieldStatus.Hidden) {
                    this.fieldsGrid[pos.row - 1][pos.column].status = FieldStatus.Visible;

                    if (!this.fieldsGrid[pos.row - 1][pos.column].hasBomb) {
                        queue.push(new BoardPosition(pos.row - 1, pos.column));
                    }
                }

                if (pos.row > 0 && pos.column < Board.SIZE - 1
                    && this.fieldsGrid[pos.row - 1][pos.column + 1].status === FieldStatus.Hidden) {
                    this.fieldsGrid[pos.row - 1][pos.column + 1].status = FieldStatus.Visible;

                    if (!this.fieldsGrid[pos.row - 1][pos.column + 1].hasBomb) {
                        queue.push(new BoardPosition(pos.row - 1, pos.column + 1));
                    }
                }

                if (pos.column > 0
                    && this.fieldsGrid[pos.row][pos.column - 1].status === FieldStatus.Hidden) {
                    this.fieldsGrid[pos.row][pos.column - 1].status = FieldStatus.Visible;

                    if (!this.fieldsGrid[pos.row][pos.column - 1].hasBomb) {
                        queue.push(new BoardPosition(pos.row, pos.column - 1));
                    }
                }

                if (pos.column < Board.SIZE - 1
                    && this.fieldsGrid[pos.row][pos.column + 1].status === FieldStatus.Hidden) {
                    this.fieldsGrid[pos.row][pos.column + 1].status = FieldStatus.Visible;

                    if (!this.fieldsGrid[pos.row][pos.column + 1].hasBomb) {
                        queue.push(new BoardPosition(pos.row, pos.column + 1));
                    }
                }

                if (pos.row < Board.SIZE - 1 && pos.column > 0
                    && this.fieldsGrid[pos.row + 1][pos.column - 1].status === FieldStatus.Hidden) {
                    this.fieldsGrid[pos.row + 1][pos.column - 1].status = FieldStatus.Visible;

                    if (!this.fieldsGrid[pos.row + 1][pos.column - 1].hasBomb) {
                        queue.push(new BoardPosition(pos.row + 1, pos.column - 1));
                    }
                }

                if (pos.row < Board.SIZE - 1
                    && this.fieldsGrid[pos.row + 1][pos.column].status === FieldStatus.Hidden) {
                    this.fieldsGrid[pos.row + 1][pos.column].status = FieldStatus.Visible;

                    if (!this.fieldsGrid[pos.row + 1][pos.column].hasBomb) {
                        queue.push(new BoardPosition(pos.row + 1, pos.column));
                    }
                }

                if (pos.row < Board.SIZE - 1 && pos.column < Board.SIZE - 1
                    && this.fieldsGrid[pos.row + 1][pos.column + 1].status === FieldStatus.Hidden) {
                    this.fieldsGrid[pos.row + 1][pos.column + 1].status = FieldStatus.Visible;

                    if (!this.fieldsGrid[pos.row + 1][pos.column + 1].hasBomb) {
                        queue.push(new BoardPosition(pos.row + 1, pos.column + 1));
                    }
                }
            }
        }
    }
}
