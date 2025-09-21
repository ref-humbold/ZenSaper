import { Component } from "@angular/core";

import { GameBoardComponent } from "src/app/components/game-board/game-board.component";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
  imports: [GameBoardComponent]
})
export class AppComponent {}
