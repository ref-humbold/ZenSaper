import { Component, ViewChildren, QueryList, AfterViewInit } from "@angular/core";
import { Subscription } from "rxjs";

import { Context } from "src/app/models/context";
import { GameState } from "src/app/models/game-state";
import { GameResult } from "src/app//models/game-result";
import { BoardPosition } from "src/app/models/board-position";
import { GameMode } from "src/app/services/interfaces/game-mode";
import { NormalModeService } from "src/app/services/normal-mode.service";
import { TrollModeService } from "src/app/services/troll-mode.service";
import { TickerService } from "src/app/services/ticker.service";
import { ContextService } from "src/app/services/context.service";
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
  public fieldsGrid: FieldComponent[][] = [];
  public seconds: number = 0;
  private readonly modes: GameMode[];
  private secondsTicker: Subscription | undefined;
  private modeIndex: number = 0;

  constructor(
    private readonly ticker: TickerService,
    private readonly contextService: ContextService,
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

  public get context(): Context {
    return this.contextService.context;
  }

  public changeMode(): void {
    this.modeIndex = 1 - this.modeIndex;
    this.ngAfterViewInit();
  }

  public startNewGame(): void {
    this.secondsTicker?.unsubscribe();
    this.seconds = 0;
    this.contextService.reload(this.currentMode.playingImage);
    this.fieldsGrid.forEach(row => row.forEach(field => field.clear()));
    this.secondsTicker = this.ticker.create(() => ++this.seconds);
  }

  public finishGame(result: GameResult): void {
    this.context.state = GameState.Finished;
    this.secondsTicker?.unsubscribe();

    if (result === GameResult.Winning) {
      this.context.faceImage = this.currentMode.winningImage;
    } else {
      this.context.faceImage = this.currentMode.losingImage;
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

    if (this.context.state === GameState.Finished) {
      this.changeMode();
    }
  }

  public onLeftClickField(position: BoardPosition): void {
    if (this.context.state === GameState.Finished) {
      return;
    }

    if (this.context.state === GameState.New) {
      const bombs: BoardPosition[] = this.generateBombs(position);

      this.countDistances(bombs);
      this.context.state = GameState.Playing;
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
    if (this.context.state !== GameState.Playing) {
      return;
    }

    const field: FieldComponent = this.fieldsGrid[position.row][position.column];

    if (field.status === FieldStatus.Hidden && this.context.flagsLeft > 0) {
      --this.context.flagsLeft;
      field.status = FieldStatus.Flagged;

      if (field.hasBomb) {
        ++this.context.score;

        if (this.context.score === this.context.bombsCount) {
          this.finishGame(GameResult.Winning);
        }
      }
    } else if (
      field.status === FieldStatus.Flagged &&
      this.context.flagsLeft < this.context.bombsCount
    ) {
      ++this.context.flagsLeft;
      field.status = FieldStatus.Hidden;

      if (field.hasBomb) {
        --this.context.score;
      }
    }
  }

  private fieldsListToGrid(): void {
    this.fieldsGrid = this.fieldsList
      .toArray()
      .sort((fd1, fd2) => fd1.position.compareTo(fd2.position))
      .reduce<FieldComponent[][]>((acc, field) => {
        if (field.position.column === 0) {
          acc.push([]);
        }

        acc[acc.length - 1]?.push(field);
        return acc;
      }, []);
  }

  private generateBombs(positionClicked: BoardPosition): BoardPosition[] {
    const bombs: BoardPosition[] = this.currentMode.initialBombs(positionClicked);

    while (bombs.length < this.context.bombsCount) {
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
