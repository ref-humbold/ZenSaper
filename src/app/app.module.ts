import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { FieldComponent } from "./field/field.component";
import { NormalBoardComponent } from "./normal-board/normal-board.component";
import { GameComponent } from './game/game.component';

@NgModule({
   declarations: [
      AppComponent,
      FieldComponent,
      NormalBoardComponent,
      GameComponent
   ],
   imports: [
      BrowserModule,
      AppRoutingModule
   ],
   providers: [],
   bootstrap: [
      AppComponent
   ]
})
export class AppModule { }
