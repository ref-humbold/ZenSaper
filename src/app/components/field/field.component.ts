import { Component, OnInit, EventEmitter, Input, Output } from "@angular/core";
import { BoardPosition } from "../../models/board-position";

export enum FieldStatus {
  Hidden,
  Visible,
  Flagged
}

@Component({
  selector: "app-field",
  templateUrl: "./field.component.html",
  styleUrls: ["./field.component.css"]
})
export class FieldComponent implements OnInit {
  @Output() public leftClickEvent: EventEmitter<BoardPosition> = new EventEmitter();
  @Output() public rightClickEvent: EventEmitter<BoardPosition> = new EventEmitter();
  public fieldStatusEnum: typeof FieldStatus = FieldStatus;
  public position: BoardPosition;
  public neighbouringBombs: number = 0;
  public status: FieldStatus = FieldStatus.Hidden;

  constructor() {}

  public ngOnInit(): void {
    this.clear();
  }

  @Input()
  public set coordinates(coords: [number, number]) {
    this.position = new BoardPosition(coords[0], coords[1]);
  }

  public get hasBomb(): boolean {
    return this.neighbouringBombs < 0;
  }

  public get isEmpty(): boolean {
    return this.neighbouringBombs === 0;
  }

  public isTextShown(): boolean {
    return this.status === FieldStatus.Visible && this.neighbouringBombs > 0;
  }

  public isBombShown(): boolean {
    return this.status === FieldStatus.Visible && this.hasBomb;
  }

  public clear(): void {
    this.status = FieldStatus.Hidden;
    this.neighbouringBombs = 0;
  }

  public addNeighbouringBomb(): void {
    if (!this.hasBomb) {
      ++this.neighbouringBombs;
    }
  }

  public createBomb(): void {
    this.neighbouringBombs = -1;
  }

  public onLeftClick(event: any): void {
    this.leftClickEvent.emit(this.position);
  }

  public onRightClick(event: any): void {
    event.preventDefault();
    this.rightClickEvent.emit(this.position);
  }
}
