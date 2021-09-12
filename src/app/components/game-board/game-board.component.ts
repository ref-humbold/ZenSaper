import { Component, ViewChildren, QueryList, AfterViewInit } from "@angular/core";
import { Subscription } from "rxjs";
import { TickerService } from "../../services/ticker.service";
import { GameState } from "../../models/game-state";
import { BoardPosition } from "../../models/board-position";
import { FieldStatus, FieldComponent } from "../field/field.component";

@Component({
  selector: "app-game-board",
  templateUrl: "./game-board.component.html",
  styleUrls: ["./game-board.component.css"]
})
export class GameBoardComponent implements AfterViewInit {
  @ViewChildren("fld") public fieldsList: QueryList<FieldComponent>;
  public fieldsGrid: FieldComponent[][];
  public readonly size: number = 16;
  public readonly bombsCount: number = 32;
  public flagsLeft: number = this.bombsCount;
  public seconds: number = 0;
  public faceImage: string = "../../../assets/epicface.jpg";
  protected secondsTicker: Subscription;
  protected state: GameState = GameState.New;
  private score: number = 0;

  constructor(private readonly ticker: TickerService) {}

  public ngAfterViewInit(): void {
    this.fieldsListToGrid();
    this.startNewGame();
  }

  public startNewGame(): void {
    if (this.secondsTicker) {
      this.secondsTicker.unsubscribe();
    }

    this.state = GameState.New;
    this.flagsLeft = this.bombsCount;
    this.seconds = 0;
    this.faceImage = "../../../assets/epicface.jpg";
    this.score = 0;
    this.fieldsGrid.forEach(rw => rw.forEach(fd => fd.clear()));
    this.secondsTicker = this.ticker.create(() => ++this.seconds);
  }

  public finishGame(winning: boolean): void {
    this.state = GameState.Finished;
    this.secondsTicker.unsubscribe();

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
      this.finishGame(false);
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

        if (this.score === this.bombsCount) {
          this.finishGame(true);
        }
      }
    } else if (field.status === FieldStatus.Flagged && this.flagsLeft < this.bombsCount) {
      ++this.flagsLeft;
      field.status = FieldStatus.Hidden;

      if (field.hasBomb) {
        --this.score;
      }
    }
  }

  private initialBombs(posClicked: BoardPosition): BoardPosition[] {
    return [];
  }

  private fieldsListToGrid(): void {
    this.fieldsGrid = new Array<FieldComponent[]>(this.size).fill(null);

    for (let i: number = 0; i < this.size; ++i) {
      this.fieldsGrid[i] = new Array<FieldComponent>(this.size).fill(null);
    }

    this.fieldsList.forEach(fd => (this.fieldsGrid[fd.position.row][fd.position.column] = fd));
  }

  private generateBombs(posClicked: BoardPosition): BoardPosition[] {
    const bombs: BoardPosition[] = this.initialBombs(posClicked);

    while (bombs.length < this.bombsCount) {
      let bombPosition: BoardPosition;

      do {
        bombPosition = new BoardPosition(
          Math.floor(Math.random() * this.size),
          Math.floor(Math.random() * this.size)
        );
      } while (
        bombs.findIndex(p => p.equals(bombPosition)) >= 0 ||
        posClicked.isNeighbour(bombPosition)
      );

      bombs.push(bombPosition);
    }

    return bombs;
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

      if (pos.row > 0 && pos.column < this.size - 1) {
        this.fieldsGrid[pos.row - 1][pos.column + 1].addNeighbouringBomb();
      }

      if (pos.column > 0) {
        this.fieldsGrid[pos.row][pos.column - 1].addNeighbouringBomb();
      }

      if (pos.column < this.size - 1) {
        this.fieldsGrid[pos.row][pos.column + 1].addNeighbouringBomb();
      }

      if (pos.row < this.size - 1 && pos.column > 0) {
        this.fieldsGrid[pos.row + 1][pos.column - 1].addNeighbouringBomb();
      }

      if (pos.row < this.size - 1) {
        this.fieldsGrid[pos.row + 1][pos.column].addNeighbouringBomb();
      }

      if (pos.row < this.size - 1 && pos.column < this.size - 1) {
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
        if (
          pos.row > 0 &&
          pos.column > 0 &&
          this.fieldsGrid[pos.row - 1][pos.column - 1].status === FieldStatus.Hidden
        ) {
          this.fieldsGrid[pos.row - 1][pos.column - 1].status = FieldStatus.Visible;

          if (!this.fieldsGrid[pos.row - 1][pos.column - 1].hasBomb) {
            queue.push(new BoardPosition(pos.row - 1, pos.column - 1));
          }
        }

        if (pos.row > 0 && this.fieldsGrid[pos.row - 1][pos.column].status === FieldStatus.Hidden) {
          this.fieldsGrid[pos.row - 1][pos.column].status = FieldStatus.Visible;

          if (!this.fieldsGrid[pos.row - 1][pos.column].hasBomb) {
            queue.push(new BoardPosition(pos.row - 1, pos.column));
          }
        }

        if (
          pos.row > 0 &&
          pos.column < this.size - 1 &&
          this.fieldsGrid[pos.row - 1][pos.column + 1].status === FieldStatus.Hidden
        ) {
          this.fieldsGrid[pos.row - 1][pos.column + 1].status = FieldStatus.Visible;

          if (!this.fieldsGrid[pos.row - 1][pos.column + 1].hasBomb) {
            queue.push(new BoardPosition(pos.row - 1, pos.column + 1));
          }
        }

        if (
          pos.column > 0 &&
          this.fieldsGrid[pos.row][pos.column - 1].status === FieldStatus.Hidden
        ) {
          this.fieldsGrid[pos.row][pos.column - 1].status = FieldStatus.Visible;

          if (!this.fieldsGrid[pos.row][pos.column - 1].hasBomb) {
            queue.push(new BoardPosition(pos.row, pos.column - 1));
          }
        }

        if (
          pos.column < this.size - 1 &&
          this.fieldsGrid[pos.row][pos.column + 1].status === FieldStatus.Hidden
        ) {
          this.fieldsGrid[pos.row][pos.column + 1].status = FieldStatus.Visible;

          if (!this.fieldsGrid[pos.row][pos.column + 1].hasBomb) {
            queue.push(new BoardPosition(pos.row, pos.column + 1));
          }
        }

        if (
          pos.row < this.size - 1 &&
          pos.column > 0 &&
          this.fieldsGrid[pos.row + 1][pos.column - 1].status === FieldStatus.Hidden
        ) {
          this.fieldsGrid[pos.row + 1][pos.column - 1].status = FieldStatus.Visible;

          if (!this.fieldsGrid[pos.row + 1][pos.column - 1].hasBomb) {
            queue.push(new BoardPosition(pos.row + 1, pos.column - 1));
          }
        }

        if (
          pos.row < this.size - 1 &&
          this.fieldsGrid[pos.row + 1][pos.column].status === FieldStatus.Hidden
        ) {
          this.fieldsGrid[pos.row + 1][pos.column].status = FieldStatus.Visible;

          if (!this.fieldsGrid[pos.row + 1][pos.column].hasBomb) {
            queue.push(new BoardPosition(pos.row + 1, pos.column));
          }
        }

        if (
          pos.row < this.size - 1 &&
          pos.column < this.size - 1 &&
          this.fieldsGrid[pos.row + 1][pos.column + 1].status === FieldStatus.Hidden
        ) {
          this.fieldsGrid[pos.row + 1][pos.column + 1].status = FieldStatus.Visible;

          if (!this.fieldsGrid[pos.row + 1][pos.column + 1].hasBomb) {
            queue.push(new BoardPosition(pos.row + 1, pos.column + 1));
          }
        }
      }
    }
  }
}
