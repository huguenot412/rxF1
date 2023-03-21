import { TestBed } from '@angular/core/testing';
import { SeasonsState, SeasonsStore } from './seasons-store';
import { SubscriberSpy, subscribeSpyTo } from '@hirez_io/observer-spy';
import { RouterTestingModule } from '@angular/router/testing';
import { SeasonsComponent } from '../components/seasons/seasons.component';
import { RouteParams } from '../enums/route-params';
import { ActivatedRoute, Params } from '@angular/router';
import { Driver } from '../models/seasons-response';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { createNewSeason } from '../utils/create-new-season';
import { DataSets } from '../enums/data-sets';
import { SeasonsService } from '../services/seasons.service';
import { BehaviorSubject, of } from 'rxjs';
import { MockProvider } from 'ng-mocks';
import { DriversResponse } from '../models/drivers-response';

describe('SeasonsStore', () => {
  let service: SeasonsStore;
  let seasonsService: SeasonsService;
  let stateMock: SeasonsState;
  const params$ = new BehaviorSubject<Params>({
    year: '2018',
    dataSet: DataSets.Drivers,
  });
  const snapshot = { params: { year: '2018', dataSet: DataSets.Drivers } };

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
        MockProvider(ActivatedRoute, { params: params$, snapshot }, 'useValue'),
      ],
    });
    service = TestBed.inject(SeasonsStore);
    seasonsService = TestBed.inject(SeasonsService);

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

  describe('pagesCount$', () => {
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

  describe('getDrivers', () => {
    it('should call seasonsService.getDrivers()', () => {
      spyOn(seasonsService, 'getDrivers').and.returnValue(
        of({} as DriversResponse)
      );

      service.getDrivers();

      expect(seasonsService.getDrivers).toHaveBeenCalled();
    });

    it('should return EMPTY if the number of results for a given page has reached its limit', () => {
      const selectedDrivers = stateMock.seasonsMap.get('2018')!.drivers;
      const selectedDriversPagesmap =
        stateMock.seasonsMap.get('2018')!.driversPagesMap;
      selectedDrivers.total = 3;
      selectedDriversPagesmap.set(2, [
        {} as Driver,
        {} as Driver,
        {} as Driver,
      ]);
      service.setState(stateMock);
      spyOn(seasonsService, 'getDrivers').and.returnValue(
        of({} as DriversResponse)
      );
      service.patchState({ currentPage: 2, resultsPerPage: 1 });
      service.getDrivers();

      expect(seasonsService.getDrivers).not.toHaveBeenCalled();
    });

    it('should return EMPTY if the number of results for the last page matches or exceeds the total amount of results', () => {
      const selectedDrivers = stateMock.seasonsMap.get('2018')!.drivers;
      const selectedDriversPagesmap =
        stateMock.seasonsMap.get('2018')!.driversPagesMap;
      selectedDrivers.total = 3;
      selectedDriversPagesmap.set(2, [
        {} as Driver,
        {} as Driver,
        {} as Driver,
      ]);
      service.setState(stateMock);
      spyOn(seasonsService, 'getDrivers').and.returnValue(
        of({} as DriversResponse)
      );
      service.patchState({ currentPage: 2, resultsPerPage: 2 });
      service.getDrivers();

      expect(seasonsService.getDrivers).not.toHaveBeenCalled();
    });
  });

  describe('updateDrivers', () => {
    it('should update the drivers property of the selected season', () => {
      const observerSpy = subscribeSpyTo(service.seasons$);
      const driverCategory = {
        total: 1,
        data: [{} as Driver],
      };
      const seasons = structuredClone(stateMock.seasonsMap);
      const season = createNewSeason({ year: '2018', drivers: driverCategory });
      seasons.set('2018', season);

      service.updateDrivers(driverCategory);

      expect(observerSpy.getLastValue()).toEqual(seasons);
    });
  });
});
