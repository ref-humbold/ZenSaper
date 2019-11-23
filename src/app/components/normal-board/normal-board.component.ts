import { Component, OnInit, ViewChildren, QueryList, AfterViewInit } from "@angular/core";
import { TickerService } from "../../services/ticker.service";
import { Board, GameState } from "../../models/board";
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
    public faceImage: string = "../../../assets/epicface.jpg";
    private score: number = 0;

    constructor(ticker: TickerService) {
        super(ticker);
    }

    public ngOnInit(): void { }

    public ngAfterViewInit(): void {
        this.fieldsListToGrid();
        this.startNewGame();
    }

    public onLeftClickField(pos: BoardPosition): void {
        if (this.state === GameState.Finished) {
            return;
        }

        if (this.state === GameState.New) {
            const bombs: BoardPosition[] = this.generateBombs(pos);

            this.countDistances(bombs);
            this.state = GameState.Played;
        }

        const field: FieldComponent = this.fieldsGrid[pos.row][pos.column];

        field.status = FieldStatus.Visible;

        if (field.hasBomb) {
            this.finishGameWithResult(false);
        } else if (field.isEmpty) {
            this.bfs(pos);
        }
    }

    public onRightClickField(pos: BoardPosition): void {
        if (this.state !== GameState.Played) {
            return;
        }

        const field: FieldComponent = this.fieldsGrid[pos.row][pos.column];

        if (field.status === FieldStatus.Hidden && this.flagsLeft > 0) {
            --this.flagsLeft;
            field.status = FieldStatus.Flagged;

            if (field.hasBomb) {
                ++this.score;

                if (this.score === Board.BOMBS_COUNT) {
                    this.finishGameWithResult(true);
                }
            }

        } else if (field.status === FieldStatus.Flagged && this.flagsLeft < Board.BOMBS_COUNT) {
            ++this.flagsLeft;
            field.status = FieldStatus.Hidden;

            if (field.hasBomb) {
                --this.score;
            }
        }
    }

    public startNewGame(): void {
        super.startNewGame();
        this.faceImage = "../../../assets/epicface.jpg";
        this.score = 0;
    }

    public finishGameWithResult(winning: boolean): void {
        super.finishGame();

        if (winning) {
            this.faceImage = "../../../assets/winface.jpg";
        } else {
            this.faceImage = "../../../assets/sadface.jpg";
            this.fieldsGrid.forEach(rw =>
                rw.forEach(fld => {
                    if (fld.hasBomb) {
                        fld.status = FieldStatus.Visible;
                    }
                })
            );
        }
    }

    protected initialBombs(posClicked: BoardPosition): BoardPosition[] {
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
        }

        for (const pos of bombs) {
            if (pos.row > 0 && pos.column > 0) {
                this.fieldsGrid[pos.row - 1][pos.column - 1].addNeighbouringBomb();
            }

            if (pos.row > 0) {
                this.fieldsGrid[pos.row - 1][pos.column].addNeighbouringBomb();
            }

            if (pos.row > 0 && pos.column < Board.SIZE - 1) {
                this.fieldsGrid[pos.row - 1][pos.column + 1].addNeighbouringBomb();
            }

            if (pos.column > 0) {
                this.fieldsGrid[pos.row][pos.column - 1].addNeighbouringBomb();
            }

            if (pos.column < Board.SIZE - 1) {
                this.fieldsGrid[pos.row][pos.column + 1].addNeighbouringBomb();
            }

            if (pos.row < Board.SIZE - 1 && pos.column > 0) {
                this.fieldsGrid[pos.row + 1][pos.column - 1].addNeighbouringBomb();
            }

            if (pos.row < Board.SIZE - 1) {
                this.fieldsGrid[pos.row + 1][pos.column].addNeighbouringBomb();
            }

            if (pos.row < Board.SIZE - 1 && pos.column < Board.SIZE - 1) {
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
