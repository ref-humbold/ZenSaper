import { Component, OnInit } from '@angular/core';
import { FieldComponent } from "../field/field.component";

@Component({
    selector: 'app-board',
    templateUrl: './board.component.html',
    styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit {
    private static readonly SIZE = 16;
    private fields: FieldComponent[][];

    constructor() {
        this.fields = new Array(BoardComponent.SIZE).fill(null)
            .map(() => new Array(BoardComponent.SIZE).fill(null));
    }

    ngOnInit() {
    }
}
