import { TestBed } from '@angular/core/testing';

import { ImagenUserService } from './imagen-user.service';

describe('ImagenUserService', () => {
  let service: ImagenUserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ImagenUserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
