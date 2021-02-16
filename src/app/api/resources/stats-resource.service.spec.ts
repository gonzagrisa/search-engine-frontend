import { TestBed } from '@angular/core/testing';

import { StatsResourceService } from './stats-resource.service';

describe('StatsResourceService', () => {
  let service: StatsResourceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StatsResourceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
