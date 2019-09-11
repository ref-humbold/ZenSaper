import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { NormalBoardComponent } from "./normal-board.component";

describe("NormalBoardComponent", () => {
    let component: NormalBoardComponent;
    let fixture: ComponentFixture<NormalBoardComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [NormalBoardComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(NormalBoardComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
