import { GameState } from "src/app/models/game-state";

export class Context {
  public readonly bombsCount: number = 32;
  public flagsLeft: number = this.bombsCount;
  public state: GameState = GameState.New;
  public score: number = 0;

  constructor(public faceImage: string) {}
}
