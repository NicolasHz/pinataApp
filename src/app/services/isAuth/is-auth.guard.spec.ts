import { TestBed, async, inject } from '@angular/core/testing';

import { IsAuthGuard } from './is-auth.guard';

describe('IsAuthGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [IsAuthGuard]
    });
  });

  it('should ...', inject([IsAuthGuard], (guard: IsAuthGuard) => {
    expect(guard).toBeTruthy();
  }));
});
