export class BoardPosition {
  constructor(public row: number, public column: number) {}

  public isNeighbour(pos: BoardPosition): boolean {
    return Math.abs(pos.row - this.row) <= 1 && Math.abs(pos.column - this.column) <= 1;
  }

  public equals(pos: BoardPosition): boolean {
    return this.row === pos.row && this.column === pos.column;
  }
}
