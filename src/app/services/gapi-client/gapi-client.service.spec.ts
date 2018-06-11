import { TestBed, inject } from '@angular/core/testing';

import { GapiClientService } from './gapi-client.service';

describe('GapiClient', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GapiClientService]
    });
  });

  it('should be created', inject([GapiClientService], (service: GapiClientService) => {
    expect(service).toBeTruthy();
  }));
});
