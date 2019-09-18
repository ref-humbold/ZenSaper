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
    public neighbouringBombs = 0;
    public status = FieldStatus.Hidden;
    @Input() public position: BoardPosition;
    @Output() public leftClickEvent: EventEmitter<BoardPosition>;
    @Output() public rightClickEvent: EventEmitter<BoardPosition>;

    constructor() { }

    ngOnInit() { }

    public get hasBomb(): boolean {
        return this.neighbouringBombs < 0;
    }

    public get isEmpty(): boolean {
        return this.neighbouringBombs === 0;
    }

    public addNeighbouringBomb(): void {
        ++this.neighbouringBombs;
    }

    public createBomb(): void {
        this.neighbouringBombs = -1;
    }
}
