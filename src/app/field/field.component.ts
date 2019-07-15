import { Component, OnInit } from '@angular/core';

enum FieldStatus {
    Hidden, Visible, Flagged
}

@Component({
    selector: 'app-field',
    templateUrl: './field.component.html',
    styleUrls: ['./field.component.css']
})
export class FieldComponent implements OnInit {
    private neighbouringBombs: number;
    private status: FieldStatus;

    constructor() {
        this.status = FieldStatus.Hidden;
        this.neighbouringBombs = 0;
    }

    ngOnInit() {
    }

    public addNeighbouringBomb() {
        ++this.neighbouringBombs;
    }

    public hasBomb() {
        return this.neighbouringBombs < 0;
    }

    public isEmpty() {
        return this.neighbouringBombs == 0;
    }

    public createBomb() {
        this.neighbouringBombs = -1;
    }
}
