import { TestBed } from '@angular/core/testing';

import { ParcelamentosService } from './parcelamentos.service';

describe('ParcelamentosService', () => {
  let service: ParcelamentosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ParcelamentosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
