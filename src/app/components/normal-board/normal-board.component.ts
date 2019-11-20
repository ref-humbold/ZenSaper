import { Component, OnInit, ViewChildren, QueryList, AfterViewInit } from "@angular/core";
import { TickerService } from "../../services/ticker.service";
import { Board } from "../../models/board";
import { BoardPosition } from "../../models/board-position";
import { FieldStatus, FieldComponent } from "../field/field.component";

@Component({
    selector: "app-normal-board",
    templateUrl: "./normal-board.component.html",
    styleUrls: ["./normal-board.component.css"]
})
export class NormalBoardComponent extends Board implements OnInit, AfterViewInit {
    @ViewChildren("fld") public fieldsList: QueryList<FieldComponent>;
    public boardClass: typeof Board = Board;

    constructor(ticker: TickerService) {
        super(ticker);
    }

    public ngOnInit(): void { }

    public ngAfterViewInit(): void {
        this.fieldsListToGrid();
        this.onNewGame();
    }

    public onLeftClickField(pos: BoardPosition): void {
        console.log("LEFT", this.fieldsGrid[pos.row][pos.column]);
    }

    public onRightClickField(pos: BoardPosition): void {
        const field: FieldComponent = this.fieldsGrid[pos.row][pos.column];

        if (field.status === FieldStatus.Hidden && this.flagsLeft > 0) {
            --this.flagsLeft;
            field.status = FieldStatus.Flagged;
        } else if (field.status === FieldStatus.Flagged && this.flagsLeft < Board.MAX_FLAGS) {
            ++this.flagsLeft;
            field.status = FieldStatus.Hidden;
        }
    }

    protected initialBombs(): BoardPosition[] {
        return [];
    }

    private fieldsListToGrid(): void {
        this.fieldsGrid = new Array<FieldComponent[]>(Board.SIZE).fill(null);

        for (let i: number = 0; i < Board.SIZE; ++i) {
            this.fieldsGrid[i] = new Array<FieldComponent>(Board.SIZE).fill(null);
        }

        this.fieldsList.forEach(fd => (this.fieldsGrid[fd.position.row][fd.position.column] = fd));
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
