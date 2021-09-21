import { Component, ViewChildren, QueryList, AfterViewInit } from "@angular/core";
import { Subscription } from "rxjs";
import { GameMode } from "../../models/game-mode";
import { GameState } from "../../models/game-state";
import { GameResult } from "../..//models/game-result";
import { BoardPosition } from "../../models/board-position";
import { NormalModeService } from "../../services/normal-mode.service";
import { TrollModeService } from "../../services/troll-mode.service";
import { TickerService } from "../../services/ticker.service";
import { FieldStatus, FieldComponent } from "../field/field.component";

@Component({
  selector: "app-game-board",
  templateUrl: "./game-board.component.html",
  styleUrls: ["./game-board.component.css"]
})
export class GameBoardComponent implements AfterViewInit {
  @ViewChildren("field") public fieldsList: QueryList<FieldComponent>;
  public fieldsGrid: FieldComponent[][];
  private readonly modes: GameMode[];
  public readonly size: number = 16;
  public readonly bombsCount: number = 32;
  public flagsLeft: number = this.bombsCount;
  public seconds: number = 0;
  public faceImage: string = "../../../assets/epicface.jpg";
  private secondsTicker: Subscription;
  private state: GameState = GameState.New;
  private score: number = 0;
  private modeIndex: number = 0;

  constructor(
    private readonly ticker: TickerService,
    normalMode: NormalModeService,
    trollMode: TrollModeService
  ) {
    this.modes = [normalMode, trollMode];
  }

  public ngAfterViewInit(): void {
    this.fieldsListToGrid();
    this.startNewGame();
  }

  public get currentMode(): GameMode {
    return this.modes[this.modeIndex];
  }

  public changeMode(): void {
    this.modeIndex = 1 - this.modeIndex;
    this.ngAfterViewInit();
  }

  public startNewGame(): void {
    if (this.secondsTicker) {
      this.secondsTicker.unsubscribe();
    }

    this.state = GameState.New;
    this.flagsLeft = this.bombsCount;
    this.seconds = 0;
    this.faceImage = this.currentMode.playingImage;
    this.score = 0;
    this.fieldsGrid.forEach(row => row.forEach(field => field.clear()));
    this.secondsTicker = this.ticker.create(() => ++this.seconds);
  }

  public finishGame(result: GameResult): void {
    this.state = GameState.Finished;
    this.secondsTicker.unsubscribe();

    if (result === GameResult.Winning) {
      this.faceImage = this.currentMode.winningImage;
    } else {
      this.faceImage = this.currentMode.losingImage;
      this.fieldsGrid.forEach(row =>
        row.forEach(field => {
          if (field.hasBomb) {
            field.status = FieldStatus.Visible;
          }
        })
      );
    }
  }

  public onLeftClickFace(): void {
    this.startNewGame();
  }

  public onRightClickFace(event: MouseEvent): void {
    event.preventDefault();

    if (this.state === GameState.Finished) {
      this.changeMode();
    }
  }

  public onLeftClickField(position: BoardPosition): void {
    if (this.state === GameState.Finished) {
      return;
    }

    if (this.state === GameState.New) {
      const bombs: BoardPosition[] = this.generateBombs(position);

      this.countDistances(bombs);
      this.state = GameState.Playing;
    }

    const field: FieldComponent = this.fieldsGrid[position.row][position.column];

    field.status = FieldStatus.Visible;

    if (field.hasBomb) {
      this.finishGame(GameResult.Losing);
    } else if (field.isEmpty) {
      this.bfs(position);
    }
  }

  public onRightClickField(position: BoardPosition): void {
    if (this.state !== GameState.Playing) {
      return;
    }

    const field: FieldComponent = this.fieldsGrid[position.row][position.column];

    if (field.status === FieldStatus.Hidden && this.flagsLeft > 0) {
      --this.flagsLeft;
      field.status = FieldStatus.Flagged;

      if (field.hasBomb) {
        ++this.score;

        if (this.score === this.bombsCount) {
          this.finishGame(GameResult.Winning);
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

  private fieldsListToGrid(): void {
    this.fieldsGrid = new Array<FieldComponent[]>(this.size).fill(null);

    for (let i: number = 0; i < this.size; ++i) {
      this.fieldsGrid[i] = new Array<FieldComponent>(this.size).fill(null);
    }

    this.fieldsList.forEach(fd => (this.fieldsGrid[fd.position.row][fd.position.column] = fd));
  }

  private generateBombs(positionClicked: BoardPosition): BoardPosition[] {
    const bombs: BoardPosition[] = this.currentMode.initialBombs(positionClicked);

    while (bombs.length < this.bombsCount) {
      let bombPosition: BoardPosition;

      do {
        bombPosition = new BoardPosition(
          Math.floor(Math.random() * this.size),
          Math.floor(Math.random() * this.size)
        );
      } while (
        bombs.findIndex(p => p.equals(bombPosition)) >= 0 ||
        positionClicked.isNeighbour(bombPosition)
      );

      bombs.push(bombPosition);
    }

    return bombs;
  }

  private countDistances(bombPositions: BoardPosition[]): void {
    for (const position of bombPositions) {
      this.fieldsGrid[position.row][position.column].createBomb();
    }

    for (const position of bombPositions) {
      if (position.row > 0 && position.column > 0) {
        this.fieldsGrid[position.row - 1][position.column - 1].addNeighbouringBomb();
      }

      if (position.row > 0) {
        this.fieldsGrid[position.row - 1][position.column].addNeighbouringBomb();
      }

      if (position.row > 0 && position.column < this.size - 1) {
        this.fieldsGrid[position.row - 1][position.column + 1].addNeighbouringBomb();
      }

      if (position.column > 0) {
        this.fieldsGrid[position.row][position.column - 1].addNeighbouringBomb();
      }

      if (position.column < this.size - 1) {
        this.fieldsGrid[position.row][position.column + 1].addNeighbouringBomb();
      }

      if (position.row < this.size - 1 && position.column > 0) {
        this.fieldsGrid[position.row + 1][position.column - 1].addNeighbouringBomb();
      }

      if (position.row < this.size - 1) {
        this.fieldsGrid[position.row + 1][position.column].addNeighbouringBomb();
      }

      if (position.row < this.size - 1 && position.column < this.size - 1) {
        this.fieldsGrid[position.row + 1][position.column + 1].addNeighbouringBomb();
      }
    }
  }

  private bfs(startPos: BoardPosition): void {
    const queue: BoardPosition[] = [startPos];

    this.fieldsGrid[startPos.row][startPos.column].status = FieldStatus.Visible;

    while (queue.length > 0) {
      const position: BoardPosition = queue.shift();

      if (this.fieldsGrid[position.row][position.column].isEmpty) {
        if (
          position.row > 0 &&
          position.column > 0 &&
          this.fieldsGrid[position.row - 1][position.column - 1].status === FieldStatus.Hidden
        ) {
          this.fieldsGrid[position.row - 1][position.column - 1].status = FieldStatus.Visible;

          if (!this.fieldsGrid[position.row - 1][position.column - 1].hasBomb) {
            queue.push(new BoardPosition(position.row - 1, position.column - 1));
          }
        }

        if (
          position.row > 0 &&
          this.fieldsGrid[position.row - 1][position.column].status === FieldStatus.Hidden
        ) {
          this.fieldsGrid[position.row - 1][position.column].status = FieldStatus.Visible;

          if (!this.fieldsGrid[position.row - 1][position.column].hasBomb) {
            queue.push(new BoardPosition(position.row - 1, position.column));
          }
        }

        if (
          position.row > 0 &&
          position.column < this.size - 1 &&
          this.fieldsGrid[position.row - 1][position.column + 1].status === FieldStatus.Hidden
        ) {
          this.fieldsGrid[position.row - 1][position.column + 1].status = FieldStatus.Visible;

          if (!this.fieldsGrid[position.row - 1][position.column + 1].hasBomb) {
            queue.push(new BoardPosition(position.row - 1, position.column + 1));
          }
        }

        if (
          position.column > 0 &&
          this.fieldsGrid[position.row][position.column - 1].status === FieldStatus.Hidden
        ) {
          this.fieldsGrid[position.row][position.column - 1].status = FieldStatus.Visible;

          if (!this.fieldsGrid[position.row][position.column - 1].hasBomb) {
            queue.push(new BoardPosition(position.row, position.column - 1));
          }
        }

        if (
          position.column < this.size - 1 &&
          this.fieldsGrid[position.row][position.column + 1].status === FieldStatus.Hidden
        ) {
          this.fieldsGrid[position.row][position.column + 1].status = FieldStatus.Visible;

          if (!this.fieldsGrid[position.row][position.column + 1].hasBomb) {
            queue.push(new BoardPosition(position.row, position.column + 1));
          }
        }

        if (
          position.row < this.size - 1 &&
          position.column > 0 &&
          this.fieldsGrid[position.row + 1][position.column - 1].status === FieldStatus.Hidden
        ) {
          this.fieldsGrid[position.row + 1][position.column - 1].status = FieldStatus.Visible;

          if (!this.fieldsGrid[position.row + 1][position.column - 1].hasBomb) {
            queue.push(new BoardPosition(position.row + 1, position.column - 1));
          }
        }

        if (
          position.row < this.size - 1 &&
          this.fieldsGrid[position.row + 1][position.column].status === FieldStatus.Hidden
        ) {
          this.fieldsGrid[position.row + 1][position.column].status = FieldStatus.Visible;

          if (!this.fieldsGrid[position.row + 1][position.column].hasBomb) {
            queue.push(new BoardPosition(position.row + 1, position.column));
          }
        }

        if (
          position.row < this.size - 1 &&
          position.column < this.size - 1 &&
          this.fieldsGrid[position.row + 1][position.column + 1].status === FieldStatus.Hidden
        ) {
          this.fieldsGrid[position.row + 1][position.column + 1].status = FieldStatus.Visible;

          if (!this.fieldsGrid[position.row + 1][position.column + 1].hasBomb) {
            queue.push(new BoardPosition(position.row + 1, position.column + 1));
          }
        }
      }
    }
  }
}
