import { inject, Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import {
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
import { StandingsList } from '../models/standings-response';
import { SeasonsService } from '../services/seasons.service';

export interface SeasonsState {
  years: string[];
  seasons: Season[];
  currentPage: number;
  resultsPerPage: number;
}

export interface SeasonUpdaterConfig {
  season: string;
  dataSet: DataSets;
  data: any;
}

const defaultState: SeasonsState = {
  years: ['2018', '2019', '2020', '2021', '2022'],
  seasons: [],
  currentPage: 1,
  resultsPerPage: 10,
};

interface SeasonsClone {
  newSeasons: Season[];
  newSeason: Season | undefined;
  newSeasonIndex: number;
}

@Injectable()
export class SeasonsStore extends ComponentStore<SeasonsState> {
  private readonly _seasonsService = inject(SeasonsService);
  private readonly _route = inject(ActivatedRoute);
  public readonly year$ = this._seasonsService.year$;
  public readonly dataSet$ = this._seasonsService.dataSet$.pipe(shareReplay());
  public readonly seasons$ = this.select(({ seasons }) => seasons);
  public readonly years$ = this.select(({ years }) => years);

  public readonly selectedSeason$ = this.select(
    this.seasons$,
    this.year$,
    (seasons, year) => seasons.find((season) => season.year == year)
  );

  public readonly selectedCategory$ = this.select(
    this.selectedSeason$,
    this.dataSet$,
    (season, dataSet: DataSets) => (season ? season[dataSet] : null)
  );

  public readonly totalResults$ = this.select(
    this.selectedCategory$,
    (category) => category?.total || 0
  );

  public readonly currentPage$ = this.select(
    ({ currentPage }) => currentPage
  ).pipe(startWith(1));

  public readonly resultsPerPage$ = this.select(
    ({ resultsPerPage }) => resultsPerPage
  );

  public readonly pagesCount$ = this.select(
    this.totalResults$,
    this.resultsPerPage$,
    (total, resultsPerPage) => Math.ceil(total / resultsPerPage)
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
      const year: string = this._route.snapshot.params[RouteParams.Year];
      let { newSeasons, newSeason, newSeasonIndex } = this._cloneSeasons(
        state.seasons,
        year
      );

      if (!newSeason) {
        newSeason = {
          drivers: driverCategory,
          year,
        } as Season;
      }

      let drivers = newSeason[DataSets.Drivers];

      if (!drivers) {
        drivers = driverCategory;
        newSeason = {
          ...newSeason,
          drivers,
        } as Season;
      }

      drivers.data = driverCategory.data;
      drivers.total = driverCategory.total;
      newSeasons.splice(newSeasonIndex, 1, newSeason);

      return {
        ...state,
        seasons: newSeasons,
      };
    }
  );

  public readonly updateResults = this.updater(
    (state: SeasonsState, resultsCategory: SeasonCategory<Race<Result>[]>) => {
      const year: string = this._route.snapshot.params[RouteParams.Year];
      let { newSeasons, newSeason, newSeasonIndex } = this._cloneSeasons(
        state.seasons,
        year
      );

      if (!newSeason) {
        newSeason = {
          results: resultsCategory,
          year,
        } as Season;
      }

      let results = newSeason[DataSets.Results];

      if (!results) {
        results = resultsCategory;
        newSeason = {
          ...newSeason,
          results,
        } as Season;
      }

      results.data = resultsCategory.data;
      results.total = resultsCategory.total;
      newSeasons.splice(newSeasonIndex, 1, newSeason);

      return {
        ...state,
        seasons: newSeasons,
      };
    }
  );

  public readonly updateQualifying = this.updater(
    (
      state: SeasonsState,
      qualifyingCategory: SeasonCategory<Race<QualifyingResult>[]>
    ) => {
      const year: string = this._route.snapshot.params[RouteParams.Year];
      let { newSeasons, newSeason, newSeasonIndex } = this._cloneSeasons(
        state.seasons,
        year
      );

      if (!newSeason) {
        newSeason = {
          qualifying: qualifyingCategory,
          year,
        } as Season;
      }

      let qualifying = newSeason[DataSets.Qualifying];

      if (!qualifying) {
        qualifying = qualifyingCategory;
        newSeason = {
          ...newSeason,
          qualifying,
        } as Season;
      }

      qualifying.data = qualifyingCategory.data;
      qualifying.total = qualifyingCategory.total;
      newSeasons.splice(newSeasonIndex, 1, newSeason);

      return {
        ...state,
        seasons: newSeasons,
      };
    }
  );

  public readonly updateStandings = this.updater(
    (
      state: SeasonsState,
      standingsCategory: SeasonCategory<StandingsList[]>
    ) => {
      const year: string = this._route.snapshot.params[RouteParams.Year];
      let { newSeasons, newSeason, newSeasonIndex } = this._cloneSeasons(
        state.seasons,
        year
      );

      if (!newSeason) {
        newSeason = {
          driverStandings: standingsCategory,
          year,
        } as Season;
      }

      let driverStandings = newSeason[DataSets.Standings];

      if (!driverStandings) {
        driverStandings = standingsCategory;
        newSeason = {
          ...newSeason,
          driverStandings: standingsCategory,
        } as Season;
      }

      driverStandings.data = standingsCategory.data;
      driverStandings.total = standingsCategory.total;
      newSeasons.splice(newSeasonIndex, 1, newSeason);

      return {
        ...state,
        seasons: newSeasons,
      };
    }
  );

  readonly getData = (config: RequestConfig): void => {
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
      withLatestFrom(this.requestConfig$),
      switchMap(([, config]) =>
        this._seasonsService.getDrivers(config).pipe(
          map((response) => ({
            total: +response.MRData.total,
            data: response.MRData.DriverTable.Drivers,
          })),
          tapResponse(
            (data) => this.updateDrivers(data),
            (error) => console.log(error)
          )
        )
      )
    );
  });

  readonly getResults = this.effect((request$: Observable<void>) => {
    return request$.pipe(
      withLatestFrom(this.requestConfig$),
      switchMap(([, config]) =>
        this._seasonsService.getResults(config).pipe(
          map((response) => ({
            total: +response.MRData.total,
            data: response.MRData.RaceTable.Races,
          })),
          tapResponse(
            (data) => this.updateResults(data),
            (error) => console.log(error)
          )
        )
      )
    );
  });

  readonly getQualifying = this.effect((request$: Observable<void>) => {
    return request$.pipe(
      withLatestFrom(this.requestConfig$),
      switchMap(([, config]) =>
        this._seasonsService.getQualifying(config).pipe(
          map((response) => ({
            total: +response.MRData.total,
            data: response.MRData.RaceTable.Races,
          })),
          tapResponse(
            (data) => this.updateQualifying(data),
            (error) => console.log(error)
          )
        )
      )
    );
  });

  readonly getStandings = this.effect((request$: Observable<void>) => {
    return request$.pipe(
      withLatestFrom(this.requestConfig$),
      switchMap(([, config]) =>
        this._seasonsService.getStandings(config).pipe(
          map((response) => ({
            total: +response.MRData.total,
            data: response.MRData.StandingsTable.StandingsLists,
          })),
          tapResponse(
            (data) => this.updateStandings(data),
            (error) => console.log(error)
          )
        )
      )
    );
  });

  private _cloneSeasons(seasons: Season[], year: string): SeasonsClone {
    const newSeasons: Season[] = structuredClone(seasons);
    const newSeason = newSeasons.find((item: Season) => item.year === year);
    const newSeasonIndex = newSeasons.findIndex(
      (item: Season) => item.year === year
    );

    return {
      newSeasons,
      newSeason,
      newSeasonIndex,
    };
  }
}
