import { TestBed } from '@angular/core/testing';

import { OpenmenuService } from './openmenu.service';

describe('OpenmenuService', () => {
  let service: OpenmenuService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OpenmenuService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
