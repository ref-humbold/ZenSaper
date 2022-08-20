import { GameState } from "src/app/models/game-state";

export class Context {
  public readonly bombsCount = 32;
  public flagsLeft = this.bombsCount;
  public state = GameState.New;
  public score = 0;

  constructor(public faceImage: string) {}
}
