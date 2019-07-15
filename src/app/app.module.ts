import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BoardComponent } from './board/board.component';
import { FieldComponent } from './field/field.component';
import { NormalBoardComponent } from './normal-board/normal-board.component';
import { NormalModeComponent } from './normal-mode/normal-mode.component';

@NgModule({
  declarations: [
    AppComponent,
    BoardComponent,
    FieldComponent,
    NormalBoardComponent,
    NormalModeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
