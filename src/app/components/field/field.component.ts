import { Component, OnInit, EventEmitter, Input, Output } from "@angular/core";

import { BoardPosition } from "src/app/models/board-position";

export const enum FieldStatus {
  Hidden = "hidden",
  Visible = "visible",
  Flagged = "flagged"
}

@Component({
  selector: "app-field",
  templateUrl: "./field.component.html",
  styleUrls: ["./field.component.css"],
  standalone: false
})
export class FieldComponent implements OnInit {
  @Output() public leftClickEvent: EventEmitter<BoardPosition> = new EventEmitter<BoardPosition>();
  @Output() public rightClickEvent: EventEmitter<BoardPosition> = new EventEmitter<BoardPosition>();

  public neighbouringBombs = 0;
  public position = new BoardPosition(0, 0);
  public status = FieldStatus.Hidden;

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

  public get cssClasses(): { [cls: string]: boolean } {
    return {
      "hidden-mode": this.status === FieldStatus.Hidden,
      "visible-mode": this.status === FieldStatus.Visible,
      "flagged-mode": this.status === FieldStatus.Flagged,
      "bomb": this.isBombShown()
    };
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

  public onLeftClick(): void {
    this.leftClickEvent.emit(this.position);
  }

  public onRightClick(event: MouseEvent): void {
    event.preventDefault();
    this.rightClickEvent.emit(this.position);
  }
}
