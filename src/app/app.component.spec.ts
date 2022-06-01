import { TestBed, ComponentFixture, waitForAsync } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { AppComponent } from "./app.component";

describe("AppComponent", () => {
  beforeEach(waitForAsync(() => {
    void TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [AppComponent]
    }).compileComponents();
  }));

  it("should create the app", () => {
    const fixture: ComponentFixture<AppComponent> = TestBed.createComponent(AppComponent);
    const app: any = fixture.debugElement.componentInstance;
    void expect(app).toBeTruthy();
  });

  it("should have as title 'ZenSaper'", () => {
    const fixture: ComponentFixture<AppComponent> = TestBed.createComponent(AppComponent);
    const app: any = fixture.debugElement.componentInstance;
    void expect(app.title).toEqual("ZenSaper");
  });

  it("should render title in a h1 tag", () => {
    const fixture: ComponentFixture<AppComponent> = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled: any = fixture.debugElement.nativeElement;
    void expect(compiled.querySelector("h1").textContent).toContain("Welcome to ZenSaper!");
  });
});
