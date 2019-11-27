import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { GameBoardComponent } from "./game-board.component";

describe("NormalBoardComponent", () => {
    let component: GameBoardComponent;
    let fixture: ComponentFixture<GameBoardComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [GameBoardComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(GameBoardComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
