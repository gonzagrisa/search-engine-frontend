import { TestBed } from '@angular/core/testing';

import { PreferencesResourceService } from './preferences-resource.service';

describe('SettingsResourceService', () => {
  let service: PreferencesResourceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PreferencesResourceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
