import { TestBed } from '@angular/core/testing';

import { MetadataResourceService } from './metadata-resource.service';

describe('MetadataResourceService', () => {
  let service: MetadataResourceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MetadataResourceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
