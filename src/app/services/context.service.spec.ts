import { TestBed, inject } from "@angular/core/testing";
import { ContextService } from "./context.service";

describe("Service: Context", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ContextService]
    });
  });

  it("should ...", inject([ContextService], (service: ContextService) => {
    void expect(service).toBeTruthy();
  }));
});
