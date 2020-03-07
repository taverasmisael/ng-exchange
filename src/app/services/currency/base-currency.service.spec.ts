import { TestBed } from '@angular/core/testing';

import { BaseCurrencyService } from './base-currency.service';

describe('BaseCurrencyService', () => {
  let service: BaseCurrencyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BaseCurrencyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
