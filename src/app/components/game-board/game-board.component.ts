import { Component, ViewChildren, QueryList, AfterViewInit } from "@angular/core";
import { Subscription } from "rxjs";

import { GameState } from "src/app/models/game-state";
import { GameResult } from "src/app//models/game-result";
import { BoardPosition } from "src/app/models/board-position";
import { GameMode } from "src/app/services/interfaces/game-mode";
import { NormalModeService } from "src/app/services/normal-mode.service";
import { TrollModeService } from "src/app/services/troll-mode.service";
import { TickerService } from "src/app/services/ticker.service";
import { FieldStatus, FieldComponent } from "src/app/components/field/field.component";

@Component({
  selector: "app-game-board",
  templateUrl: "./game-board.component.html",
  styleUrls: ["./game-board.component.css"]
})
export class GameBoardComponent implements AfterViewInit {
  @ViewChildren("field") public fieldsList: QueryList<FieldComponent> =
    new QueryList<FieldComponent>();

  public readonly size: number = 16;
  public readonly bombsCount: number = 32;
  public fieldsGrid: FieldComponent[][] = [];
  public flagsLeft: number = this.bombsCount;
  public seconds: number = 0;
  public faceImage: string = "assets/epicface.jpg";

  private readonly modes: GameMode[];
  private secondsTicker: Subscription | undefined;
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
    this.secondsTicker?.unsubscribe();
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
    this.secondsTicker?.unsubscribe();

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
    const fieldArray: FieldComponent[] = this.fieldsList.toArray();

    fieldArray.sort((fd1, fd2) =>
      fd1.position.row < fd2.position.row
        ? -1
        : fd1.position.row > fd2.position.row
        ? 1
        : fd1.position.column < fd2.position.column
        ? -1
        : fd1.position.column > fd2.position.column
        ? 1
        : 0
    );

    this.fieldsGrid = this.fieldsList.reduce((acc, field) => {
      if (field.position.column === 0) {
        acc.push([]);
      }

      acc[acc.length - 1]?.push(field);
      return acc;
    }, [] as FieldComponent[][]);
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
    let position: BoardPosition | undefined = startPos;
    const queue: BoardPosition[] = [];

    this.fieldsGrid[startPos.row][startPos.column].status = FieldStatus.Visible;

    while (position !== undefined) {
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

        position = queue.shift();
      }
    }
  }
}
