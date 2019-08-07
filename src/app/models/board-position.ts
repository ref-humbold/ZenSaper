export class BoardPosition {
    public row: number;
    public column: number;

    constructor(row: number, column: number) {
        this.row = row;
        this.column = column;
    }

    public isNeighbour(pos: BoardPosition) {
        return Math.abs(pos.row - this.row) <= 1 && Math.abs(pos.column - this.column);
    }
}
