import { Component, OnInit } from "@angular/core";

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
    public neighbouringBombs: number;
    public status: FieldStatus;

    constructor() {
        this.status = FieldStatus.Hidden;
        this.neighbouringBombs = 0;
    }

    ngOnInit() { }

    public get hasBomb() {
        return this.neighbouringBombs < 0;
    }

    public get isEmpty() {
        return this.neighbouringBombs === 0;
    }

    public addNeighbouringBomb() {
        ++this.neighbouringBombs;
    }

    public createBomb() {
        this.neighbouringBombs = -1;
    }
}
