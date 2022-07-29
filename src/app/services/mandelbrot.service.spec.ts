import { TestBed } from '@angular/core/testing';

import { MandelbrotService } from './mandelbrot.service';

describe('MandelbrotService', () => {
  let service: MandelbrotService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MandelbrotService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
