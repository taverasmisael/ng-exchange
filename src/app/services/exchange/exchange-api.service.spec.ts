import { TestBed } from '@angular/core/testing';

import { ExchangeAPIService } from './exchange-api.service';

describe('ExchangeAPIService', () => {
  let service: ExchangeAPIService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExchangeAPIService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
