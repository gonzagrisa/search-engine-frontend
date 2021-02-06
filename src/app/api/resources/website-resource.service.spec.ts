import { TestBed } from '@angular/core/testing';

import { WebsiteResourceService } from './website-resource.service';

describe('WebsiteResourceService', () => {
  let service: WebsiteResourceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WebsiteResourceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
