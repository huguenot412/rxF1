import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { SeasonsState, SeasonsStore } from './seasons-store';
import { SubscriberSpy, subscribeSpyTo } from '@hirez_io/observer-spy';
import { RouterTestingModule } from '@angular/router/testing';
import { SeasonsComponent } from '../components/seasons/seasons.component';
import { RouteParams } from '../enums/route-params';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Season, SeasonCategory } from '../models/season';
import { Driver } from '../models/seasons-response';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';
import { createNewSeason } from '../utils/create-new-season';
import { DataSets } from '../enums/data-sets';
import { SeasonsService } from '../services/seasons.service';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { AppComponent } from '../app.component';
import { MockProvider } from 'ng-mocks';

describe('SeasonsStore', () => {
  let service: SeasonsStore;
  let router: Router;
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
  let drivers: Driver[];
  let driversState: SeasonCategory<Driver[]>;
  let stateMock: SeasonsState;
  let year: string;
  let dataSet: DataSets;
  let route: ActivatedRoute;
  let location: Location;
  let fixture;
  const params$ = new BehaviorSubject<Params>({
    year: '2018',
    dataSet: DataSets.Drivers,
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([
          { path: 'seasons', component: SeasonsComponent },
          {
            path: `seasons/:${RouteParams.Year}`,
            component: SeasonsComponent,
          },
          {
            path: `seasons/:year/:${RouteParams.DataSet}`,
            component: SeasonsComponent,
          },
        ]),
        HttpClientTestingModule,
      ],
      providers: [
        SeasonsStore,
        SeasonsService,
        MockProvider(ActivatedRoute, { params: params$ }, 'useValue'),
      ],
    });
    service = TestBed.inject(SeasonsStore);
    router = TestBed.inject(Router);
    route = TestBed.inject(ActivatedRoute);
    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);

    stateMock = {
      years: ['2018', '2019', '2020', '2021', '2022'],
      seasonsMap: new Map([
        ['2018', createNewSeason({ year: '2018' })],
        ['2019', createNewSeason({ year: '2019' })],
        ['2020', createNewSeason({ year: '2020' })],
        ['2021', createNewSeason({ year: '2021' })],
        ['2022', createNewSeason({ year: '2022' })],
      ]),
      currentPage: 1,
      resultsPerPage: 10,
      loadingData: false,
    };
  });

  fdescribe('pagesCount$', () => {
    let observerSpy: SubscriberSpy<number>;

    beforeEach(() => {
      observerSpy = subscribeSpyTo(service.pagesCount$);
    });

    it('should initialize with a value of 0', () => {
      expect(observerSpy.getFirstValue()).toEqual(0);
    });

    it('should emit a number of pages equal to the total results divided by results per page (rounded up) after results per page has changed', () => {
      const selectedDrivers = stateMock.seasonsMap.get('2018')!.drivers;
      selectedDrivers.total = 34;
      service.setState(stateMock);

      service.patchState({ resultsPerPage: 25 });
      expect(observerSpy.getLastValue()).toEqual(2);
    });

    it('should emit a number of pages equal to the total results divided by results per page (rounded up) after category with different total has been selected', () => {
      const selectedDrivers = stateMock.seasonsMap.get('2018')!.drivers;
      const selectedResults = stateMock.seasonsMap.get('2018')!.results;
      selectedDrivers.total = 34;
      selectedResults.total = 56;
      service.setState(stateMock);
      params$.next({ year: '2018', dataSet: DataSets.Results });
      expect(observerSpy.getLastValue()).toEqual(6);
    });
  });
});
