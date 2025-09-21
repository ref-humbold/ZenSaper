import { TestBed, ComponentFixture, waitForAsync } from "@angular/core/testing";
import { provideRouter } from "@angular/router";

import { AppComponent } from "./app.component";

describe("AppComponent", () => {
  beforeEach(waitForAsync(() => {
    void TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [provideRouter([])]
    }).compileComponents();
  }));

  it("should create the app", () => {
    const fixture: ComponentFixture<AppComponent> = TestBed.createComponent(AppComponent);
    const app: AppComponent = fixture.debugElement.componentInstance as AppComponent;
    void expect(app).toBeTruthy();
  });
});
