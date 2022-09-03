export class BoardPosition {
  constructor(public row: number, public column: number) {}

  public isNeighbour(position: BoardPosition): boolean {
    return Math.abs(position.row - this.row) <= 1 && Math.abs(position.column - this.column) <= 1;
  }

  public equals(position: BoardPosition): boolean {
    return this.row === position.row && this.column === position.column;
  }

  public compareTo(position: BoardPosition): number {
    return this.row === position.row ? this.column - position.column : this.row - position.row;
  }
}
