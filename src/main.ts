/* eslint-disable no-console */
import { enableProdMode, importProvidersFrom, provideZoneChangeDetection } from "@angular/core";
import { BrowserModule, bootstrapApplication } from "@angular/platform-browser";

import { environment } from "src/environments/environment";
import { AppComponent } from "src/app/app.component";

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [provideZoneChangeDetection(), importProvidersFrom(BrowserModule)]
}).catch(err => console.error(err));
