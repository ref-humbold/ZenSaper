import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";

import { FieldComponent } from "./field.component";

describe("FieldComponent", () => {
  let component: FieldComponent;
  let fixture: ComponentFixture<FieldComponent>;

  beforeEach(waitForAsync(() => {
    void TestBed.configureTestingModule({
      imports: [FieldComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    void expect(component).toBeTruthy();
  });
});
