import { TestBed } from '@angular/core/testing';

import { DefaultProductService } from './default-product.service';

describe('DefaultProductService', () => {
  let service: DefaultProductService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DefaultProductService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
