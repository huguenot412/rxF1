import { inject, Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import {
  EMPTY,
  map,
  Observable,
  shareReplay,
  startWith,
  switchMap,
  tap,
  withLatestFrom,
} from 'rxjs';
import { DataSets } from '../enums/data-sets';
import { RouteParams } from '../enums/route-params';
import { RequestConfig } from '../models/request-config';
import { QualifyingResult } from '../models/qualifying-response';
import { Result } from '../models/results-response';
import { Season, SeasonCategory } from '../models/season';
import { Driver, Race } from '../models/seasons-response';
import { DriverStanding, StandingsList } from '../models/standings-response';
import { SeasonsService } from '../services/seasons.service';
import { create } from 'mutative';
import { createNewSeason } from '../utils/create-new-season';

export interface SeasonsState {
  years: string[];
  seasonsMap: Map<string, Season>;
  currentPage: number;
  resultsPerPage: number;
  loadingData: boolean;
}

export interface SeasonUpdaterConfig {
  season: string;
  dataSet: DataSets;
  data: any;
}

const years = ['2018', '2019', '2020', '2021', '2022'];
const seasonsMap = new Map(
  years.map((year) => [year, createNewSeason({ year })])
);
const defaultState: SeasonsState = {
  years,
  seasonsMap,
  currentPage: 1,
  resultsPerPage: 10,
  loadingData: false,
};

@Injectable()
export class SeasonsStore extends ComponentStore<SeasonsState> {
  private readonly _seasonsService = inject(SeasonsService);
  private readonly _route = inject(ActivatedRoute);
  public year$ = this._route.params.pipe(
    map((params) => params[RouteParams.Year]),
    shareReplay()
  );
  public dataSet$: Observable<DataSets> = this._route.params.pipe(
    map((params) => params[RouteParams.DataSet]),
    shareReplay()
  );
  public readonly seasons$ = this.select(({ seasonsMap }) => seasonsMap);
  public readonly years$ = this.select(({ years }) => years);

  public readonly selectedSeason$ = this.select(
    this.seasons$,
    this.year$,
    (seasons, year) => seasons.get(year)
  ).pipe(shareReplay());

  public readonly selectedCategory$ = this.select(
    this.selectedSeason$,
    this.dataSet$,
    (season, dataSet: DataSets) => (season ? season[dataSet] : null)
  ).pipe(shareReplay());

  public readonly totalResults$ = this.select(
    this.seasons$,
    this.year$,
    this.dataSet$,
    (seasons, year, dataSet) => {
      const season = seasons.get(year);

      if (season) return season[dataSet].total;

      return 0;
    }
  );

  public readonly currentPage$ = this.select(
    ({ currentPage }) => currentPage
  ).pipe(startWith(1));

  public readonly resultsPerPage$ = this.select(
    ({ resultsPerPage }) => resultsPerPage
  );

  public readonly loadingData$ = this.select(({ loadingData }) => loadingData);

  public readonly pagesCount$ = this.select(
    this.totalResults$,
    this.resultsPerPage$,
    (total, resultsPerPage) => Math.ceil(total / resultsPerPage) || 0
  );

  public readonly pages$ = this.select(this.pagesCount$, (pageCount) =>
    [...Array(pageCount).keys()].map((num) => num + 1)
  );

  public readonly selectedDrivers$ = this.select(
    this.selectedSeason$,
    (season) => season?.drivers?.data || ([] as Driver[])
  );

  public readonly selectedQualifyingResults$ = this.select(
    this.selectedSeason$,
    (season) => season?.qualifying?.data || ([] as Race<QualifyingResult>[])
  );

  public readonly selectedResults$ = this.select(
    this.selectedSeason$,
    (season) => season?.results?.data
  );

  public readonly selectedDriverStandings$ = this.select(
    this.selectedSeason$,
    (season) => season?.driverStandings?.data
  );

  public readonly driversPagesMap$ = this.select(
    this.selectedSeason$,
    (selectedSeason) =>
      selectedSeason?.driversPagesMap || (new Map() as Map<number, Driver[]>)
  );
  public readonly resultsPagesMap$ = this.select(
    this.selectedSeason$,
    (selectedSeason) =>
      selectedSeason?.resultsPagesMap ||
      (new Map() as Map<number, Race<Result>[]>)
  );
  public readonly qualifyingPagesMap$ = this.select(
    this.selectedSeason$,
    (selectedSeason) =>
      selectedSeason?.qualifyingPagesMap ||
      (new Map() as Map<number, Race<QualifyingResult>[]>)
  );
  public readonly standingsPagesMap$ = this.select(
    this.selectedSeason$,
    (selectedSeason) =>
      selectedSeason?.standingsPagesMap ||
      (new Map() as Map<number, StandingsList[]>)
  );

  public readonly aggregatedResults$ = this.select(
    this.selectedSeason$,
    (season) => {
      let results: Result[] = [];
      season?.results?.data.forEach(
        (race) => (results = [...results, ...race.Results!])
      );

      return results;
    }
  );

  public readonly totalFinished$ = this.select(
    this.aggregatedResults$,
    (results) => results.filter((result) => result.status === 'Finished').length
  );

  public readonly totalAccident$ = this.select(
    this.aggregatedResults$,
    (results) => results.filter((result) => result.status === 'Accident').length
  );

  public readonly totalPlus1$ = this.select(
    this.aggregatedResults$,
    (results) => results.filter((result) => result.status === '+1 Lap').length
  );

  public offset$ = this.select(
    this.resultsPerPage$,
    this.currentPage$,
    (resultsPerPage, currentPage) =>
      resultsPerPage * currentPage - resultsPerPage
  );

  public readonly requestConfig$ = this.select(
    this.year$,
    this.dataSet$,
    this.resultsPerPage$,
    this.offset$,
    (year, dataSet, limit, offset) => ({ year, dataSet, limit, offset })
  );

  public readonly routeParams$ = this.select(
    this.year$,
    this.dataSet$,
    (year, dataSet) => ({ year, dataSet })
  ).pipe(
    withLatestFrom(this.requestConfig$),
    tap(([, config]) => {
      this.patchState({ currentPage: 1 });
      this.getData(config);
    })
  );

  constructor() {
    super(defaultState);
  }

  public readonly updateDrivers = this.updater(
    (state: SeasonsState, driverCategory: SeasonCategory<Driver[]>) => {
      const year = this._route.snapshot.params[RouteParams.Year];

      return create(state, (draft) => {
        const season = draft.seasonsMap.get(year);

        if (season) {
          season.drivers = driverCategory;
        } else {
          draft.seasonsMap.set(year, createNewSeason({ year }));
        }
      });
    }
  );

  public readonly updateResults = this.updater(
    (state: SeasonsState, resultsCategory: SeasonCategory<Race<Result>[]>) => {
      const year: string = this._route.snapshot.params[RouteParams.Year];

      return create(state, (draft) => {
        const season = draft.seasonsMap.get(year);

        if (season) {
          season.results = resultsCategory;
        } else {
          draft.seasonsMap.set(year, createNewSeason({ year }));
        }
      });
    }
  );

  public readonly updateQualifying = this.updater(
    (
      state: SeasonsState,
      qualifyingCategory: SeasonCategory<Race<QualifyingResult>[]>
    ) => {
      const year: string = this._route.snapshot.params[RouteParams.Year];
      return create(state, (draft) => {
        const season = draft.seasonsMap.get(year);

        if (season) {
          season.qualifying = qualifyingCategory;
        } else {
          draft.seasonsMap.set(year, createNewSeason({ year }));
        }
      });
    }
  );

  public readonly updateStandings = this.updater(
    (
      state: SeasonsState,
      standingsCategory: SeasonCategory<StandingsList[]>
    ) => {
      const year: string = this._route.snapshot.params[RouteParams.Year];
      return create(state, (draft) => {
        const season = draft.seasonsMap.get(year);

        if (season) {
          season.driverStandings = standingsCategory;
        } else {
          draft.seasonsMap.set(year, createNewSeason({ year }));
        }
      });
    }
  );

  public readonly updateDriversPagesMap = this.updater(
    (state: SeasonsState, drivers: Driver[]) => {
      const year = this._route.snapshot.params[RouteParams.Year];

      return create(state, (draft) => {
        draft.seasonsMap
          .get(year)
          ?.driversPagesMap.set(state.currentPage, drivers);
      });
    }
  );

  public readonly updateResultsPagesMap = this.updater(
    (state: SeasonsState, results: Race<Result>[]) => {
      const year = this._route.snapshot.params[RouteParams.Year];

      return create(state, (draft) => {
        draft.seasonsMap
          .get(year)
          ?.resultsPagesMap.set(state.currentPage, results);
      });
    }
  );

  public readonly updateQualifyingPagesMap = this.updater(
    (state: SeasonsState, qualifying: Race<QualifyingResult>[]) => {
      const year = this._route.snapshot.params[RouteParams.Year];

      return create(state, (draft) => {
        draft.seasonsMap
          .get(year)
          ?.qualifyingPagesMap.set(state.currentPage, qualifying);
      });
    }
  );

  public readonly updateStandingsPagesMap = this.updater(
    (state: SeasonsState, standings: StandingsList[]) => {
      const year = this._route.snapshot.params[RouteParams.Year];

      return create(state, (draft) => {
        draft.seasonsMap
          .get(year)
          ?.standingsPagesMap.set(state.currentPage, standings);
      });
    }
  );

  public readonly resetPagesMaps = this.updater((state: SeasonsState) => {
    return create(state, (draft) => {
      console.log(draft);
      draft.seasonsMap.forEach((season) => {
        season.driversPagesMap.clear();
        season.resultsPagesMap.clear();
        season.qualifyingPagesMap.clear();
        season.standingsPagesMap.clear();
      });
    });
  });

  public readonly getData = (config: RequestConfig): void => {
    switch (config.dataSet) {
      case DataSets.Drivers:
        this.getDrivers();
        break;
      case DataSets.Qualifying:
        this.getQualifying();
        break;
      case DataSets.Results:
        this.getResults();
        break;
      case DataSets.Standings:
        this.getStandings();
        break;
    }
  };

  readonly getDrivers = this.effect((request$: Observable<void>) => {
    return request$.pipe(
      withLatestFrom(
        this.requestConfig$,
        this.driversPagesMap$,
        this.currentPage$,
        this.resultsPerPage$,
        this.selectedCategory$
      ),
      switchMap(
        ([
          ,
          config,
          driversPagesMap,
          currentPage,
          resultsPerPage,
          selectedCategory,
        ]) => {
          const pageCount = driversPagesMap?.get(currentPage)?.length || 0;
          const totalCount = (currentPage - 1) * resultsPerPage + pageCount;

          if (
            pageCount === resultsPerPage ||
            (pageCount !== 0 && totalCount >= selectedCategory!.total)
          )
            return EMPTY;

          this.patchState({ loadingData: true });

          return this._seasonsService.getDrivers(config).pipe(
            map((response) => ({
              total: +response.MRData.total,
              data: response.MRData.DriverTable.Drivers,
            })),
            tapResponse(
              (data) => {
                this.updateDrivers(data);
                this.updateDriversPagesMap(data.data);
                this.patchState({ loadingData: false });
              },
              (error) => {
                console.log(error);
                this.patchState({ loadingData: false });
              }
            )
          );
        }
      )
    );
  });

  readonly getResults = this.effect((request$: Observable<void>) => {
    return request$.pipe(
      withLatestFrom(
        this.requestConfig$,
        this.resultsPagesMap$,
        this.currentPage$,
        this.resultsPerPage$,
        this.selectedCategory$
      ),
      switchMap(
        ([
          ,
          config,
          resultsPagesMap,
          currentPage,
          resultsPerPage,
          selectedCategory,
        ]) => {
          const pageCount =
            resultsPagesMap
              .get(currentPage)
              ?.reduce((accumulator, currentValue) => {
                return (accumulator = [
                  ...accumulator,
                  ...currentValue.Results!,
                ]);
              }, [] as Result[]).length || 0;
          const totalCount = (currentPage - 1) * resultsPerPage + pageCount;

          if (
            pageCount === resultsPerPage ||
            (pageCount !== 0 && totalCount >= selectedCategory!.total)
          )
            return EMPTY;

          this.patchState({ loadingData: true });

          return this._seasonsService.getResults(config).pipe(
            map((response) => ({
              total: +response.MRData.total,
              data: response.MRData.RaceTable.Races,
            })),
            tapResponse(
              (data) => {
                this.updateResults(data);
                this.updateResultsPagesMap(data.data);
                this.patchState({ loadingData: false });
              },
              (error) => {
                console.log(error);
                this.patchState({ loadingData: false });
              }
            )
          );
        }
      )
    );
  });

  readonly getQualifying = this.effect((request$: Observable<void>) => {
    return request$.pipe(
      withLatestFrom(
        this.requestConfig$,
        this.qualifyingPagesMap$,
        this.currentPage$,
        this.resultsPerPage$,
        this.selectedCategory$
      ),
      switchMap(
        ([
          ,
          config,
          qualifyingPagesMap,
          currentPage,
          resultsPerPage,
          selectedCategory,
        ]) => {
          const pageCount =
            qualifyingPagesMap
              .get(currentPage)
              ?.reduce((accumulator, currentValue) => {
                return (accumulator = [
                  ...accumulator,
                  ...currentValue.QualifyingResults!,
                ]);
              }, [] as QualifyingResult[]).length || 0;
          const totalCount = (currentPage - 1) * resultsPerPage + pageCount;

          if (
            pageCount === resultsPerPage ||
            (pageCount !== 0 && totalCount >= selectedCategory!.total)
          )
            return EMPTY;

          this.patchState({ loadingData: true });

          return this._seasonsService.getQualifying(config).pipe(
            map((response) => ({
              total: +response.MRData.total,
              data: response.MRData.RaceTable.Races,
            })),
            tapResponse(
              (data) => {
                this.updateQualifying(data);
                this.updateQualifyingPagesMap(data.data);
                this.patchState({ loadingData: false });
              },
              (error) => {
                console.log(error);
                this.patchState({ loadingData: false });
              }
            )
          );
        }
      )
    );
  });

  readonly getStandings = this.effect((request$: Observable<void>) => {
    return request$.pipe(
      withLatestFrom(
        this.requestConfig$,
        this.standingsPagesMap$,
        this.currentPage$,
        this.resultsPerPage$,
        this.selectedCategory$
      ),
      switchMap(
        ([
          ,
          config,
          standingsPagesMap,
          currentPage,
          resultsPerPage,
          selectedCategory,
        ]) => {
          const pageCount =
            standingsPagesMap
              .get(currentPage)
              ?.reduce((accumulator, currentValue) => {
                return (accumulator = [
                  ...accumulator,
                  ...currentValue.DriverStandings!,
                ]);
              }, [] as DriverStanding[]).length || 0;
          const totalCount = (currentPage - 1) * resultsPerPage + pageCount;

          if (
            pageCount === resultsPerPage ||
            (pageCount !== 0 && totalCount >= selectedCategory!.total)
          )
            return EMPTY;

          this.patchState({ loadingData: true });

          return this._seasonsService.getStandings(config).pipe(
            map((response) => ({
              total: +response.MRData.total,
              data: response.MRData.StandingsTable.StandingsLists,
            })),
            tapResponse(
              (data) => {
                this.updateStandings(data);
                this.updateStandingsPagesMap(data.data);
                this.patchState({ loadingData: false });
              },
              (error) => {
                console.log(error);
                this.patchState({ loadingData: false });
              }
            )
          );
        }
      )
    );
  });
}
