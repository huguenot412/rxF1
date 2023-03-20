import { TestBed } from '@angular/core/testing';
import { SeasonsState, SeasonsStore } from './seasons-store';
import { SubscriberSpy, subscribeSpyTo } from '@hirez_io/observer-spy';
import { RouterTestingModule } from '@angular/router/testing';
import { SeasonsComponent } from '../components/seasons/seasons.component';
import { RouteParams } from '../enums/route-params';
import { Router } from '@angular/router';
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

describe('SeasonsStore', () => {
  let service: SeasonsStore;
  let router: Router;
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
  let drivers: Driver[];
  let driversState: SeasonCategory<Driver[]>;
  let state: SeasonsState;
  let year: string;
  let dataSet: DataSets;

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
      providers: [SeasonsStore, SeasonsService],
    });
    service = TestBed.inject(SeasonsStore);
    router = TestBed.inject(Router);
    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);

    state = {
      years: ['2018', '2019', '2020', '2021', '2022'],
      seasons: [
        createNewSeason({ year: '2018' }),
        createNewSeason({ year: '2019' }),
        createNewSeason({ year: '2020' }),
        createNewSeason({ year: '2021' }),
        createNewSeason({ year: '2022' }),
      ],
      currentPage: 1,
      resultsPerPage: 10,
      loadingData: false,
    };
    year = '2018';
    dataSet = DataSets.Drivers;
    router.navigate(['seasons', year, dataSet]);
    service.setState(state);
  });

  fdescribe('pagesCount$', () => {
    let observerSpy: SubscriberSpy<number>;

    beforeEach(() => {
      observerSpy = subscribeSpyTo(service.pagesCount$);
    });

    it('should initialize with a value of 0', () => {
      expect(observerSpy.getFirstValue()).toEqual(0);
    });

    it('should emit a number of pages equal to the total results divided by results per page, rounded up', () => {
      const selectedSeason = state.seasons.find(
        (season) => season.year === year
      );
      const selectedDrivers = selectedSeason!.drivers;
      selectedDrivers.total = 47;
      state.resultsPerPage = 10;

      service.setState(state);
      service.patchState({ resultsPerPage: 25 });

      expect(observerSpy.getLastValue()).toEqual(2);
    });
  });
});
