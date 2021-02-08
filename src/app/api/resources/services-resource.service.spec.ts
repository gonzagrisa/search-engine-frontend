import { TestBed } from '@angular/core/testing';

import { ServicesResourceService } from './services-resource.service';

describe('ServicesResourceService', () => {
  let service: ServicesResourceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServicesResourceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
