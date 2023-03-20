import { TestBed } from '@angular/core/testing';
import { SeasonsStore } from './seasons-store';

describe('SeasonsStore', () => {
  let service: SeasonsStore;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SeasonsStore);
  });

  describe('pagesCount$', () => {
    it('returns the amount of paginated pages', () => {
      service.pagesCount$.subscribe((pagesCount) => {});
    });
  });
});
