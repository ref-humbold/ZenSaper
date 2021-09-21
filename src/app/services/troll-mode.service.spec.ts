/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { TrollModeService } from './troll-mode.service';

describe('Service: TrollMode', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TrollModeService]
    });
  });

  it('should ...', inject([TrollModeService], (service: TrollModeService) => {
    expect(service).toBeTruthy();
  }));
});
