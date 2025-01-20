import { TestBed } from '@angular/core/testing';

import { ConstraintGeneratorService } from './constraint-generator.service';

describe('ConstraintGeneratorService', () => {
  let service: ConstraintGeneratorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConstraintGeneratorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
