import { HttpClient, HttpHandler } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, Params } from '@angular/router';
import { MockProvider } from 'ng-mocks';
import { BehaviorSubject } from 'rxjs';
import { DataSets } from 'src/app/enums/data-sets';
import { RequestConfig } from 'src/app/models/request-config';
import { SeasonsStore } from 'src/app/stores/seasons-store';

import { PaginationComponent } from './pagination.component';

describe('PaginationComponent', () => {
  let component: PaginationComponent;
  let fixture: ComponentFixture<PaginationComponent>;
  let seasonsStore: SeasonsStore;
  const currentPage = 1;
  const resultsPerPage = 10;
  const requestConfig = {
    year: '2018',
    dataSet: DataSets.Drivers,
    limit: 10,
    offset: 0,
  };
  const params$ = new BehaviorSubject<Params>({
    year: '2018',
    dataSet: DataSets.Drivers,
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaginationComponent, BrowserAnimationsModule],
      providers: [
        SeasonsStore,
        HttpClient,
        HttpHandler,
        MockProvider(ActivatedRoute, { params: params$ }, 'useValue'),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PaginationComponent);
    seasonsStore = TestBed.inject(SeasonsStore);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('updateCurrentPage', () => {
    it('should call patchState on the seasonsStore with the current page number', () => {
      spyOn(seasonsStore, 'patchState');
      component.updateCurrentPage(currentPage, requestConfig);

      expect(seasonsStore.patchState).toHaveBeenCalledWith({ currentPage });
    });

    it('should call getData on the seasonsStore with the request config', () => {
      spyOn(seasonsStore, 'getData');
      component.updateCurrentPage(currentPage, requestConfig);

      expect(seasonsStore.getData).toHaveBeenCalledWith(requestConfig);
    });
  });

  describe('changeResultsPerPage', () => {
    it('should call patchState on the seasonsStore with the current page number and results per page', () => {
      spyOn(seasonsStore, 'patchState');
      component.changeResultsPerPage(resultsPerPage, requestConfig);

      expect(seasonsStore.patchState).toHaveBeenCalledWith({
        resultsPerPage,
        currentPage: 1,
      });
    });

    it('should call resetPagesMaps on the seasonsStore', () => {
      spyOn(seasonsStore, 'resetPagesMaps');
      component.changeResultsPerPage(resultsPerPage, requestConfig);

      expect(seasonsStore.resetPagesMaps).toHaveBeenCalled();
    });

    it('should call getData on the seasonsStore with the request config', () => {
      spyOn(seasonsStore, 'getData');
      component.changeResultsPerPage(resultsPerPage, requestConfig);

      expect(seasonsStore.getData).toHaveBeenCalledWith(requestConfig);
    });
  });
});
