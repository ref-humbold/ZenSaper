import { TestBed, inject } from "@angular/core/testing";
import { NormalModeService } from "./normal-mode.service";

describe("Service: NormalMode", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NormalModeService]
    });
  });

  it("should ...", inject([NormalModeService], (service: NormalModeService) => {
    void expect(service).toBeTruthy();
  }));
});
