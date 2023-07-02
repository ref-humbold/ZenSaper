import { TestBed, inject } from "@angular/core/testing";
import { TickerService } from "./ticker.service";

describe("Service: Ticker", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TickerService]
    });
  });

  it("should create", inject([TickerService], (service: TickerService) => {
    void expect(service).toBeTruthy();
  }));
});
