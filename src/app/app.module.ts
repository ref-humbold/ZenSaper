import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";

import { AppComponent } from "src/app/app.component";
import { FieldComponent } from "src/app/components/field/field.component";
import { GameBoardComponent } from "src/app/components/game-board/game-board.component";

@NgModule({
  declarations: [AppComponent, FieldComponent, GameBoardComponent],
  imports: [BrowserModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
