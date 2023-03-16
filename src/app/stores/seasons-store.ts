import { inject, Injectable } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import {
  exhaustMap,
  map,
  Observable,
  share,
  shareReplay,
  startWith,
  switchMap,
  tap,
  withLatestFrom,
} from 'rxjs';
import { DataSets } from '../enums/data-sets';
import { RouteParams } from '../enums/route-params';
import { Years } from '../enums/years.enum';
import { DriversResponse } from '../models/drivers-response';
import { RequestConfig } from '../models/get-seasons-config';
import {
  QualifyingResponse,
  QualifyingResult,
} from '../models/qualifying-response';
import { Result, ResultsResponse } from '../models/results-response';
import { Season, SeasonCategory } from '../models/season';
import { Driver, Race } from '../models/seasons-response';
import {
  DriverStanding,
  StandingsList,
  StandingsResponse,
} from '../models/standings-response';
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
  public readonly dataSet$ = this._seasonsService.dataSet$;
  public readonly seasons$ = this.select(({ seasons }) => seasons).pipe(
    tap((data) => console.log(data))
  );
  public readonly routeParams$ = this.select(
    this.year$,
    this.dataSet$,
    (year, dataSet) => ({ year, dataSet })
  ).pipe(tap(() => this.patchState({ currentPage: 1 })));
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
    (data) => Number(data?.MRData.total) || 0
  );
  public readonly currentPage$ = this.select(({ currentPage }) => currentPage);
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
    (season) => season?.drivers?.MRData.DriverTable.Drivers || ([] as Driver[])
  );
  public readonly selectedQualifyingResults$ = this.select(
    this.selectedSeason$,
    (season) => {
      let qualifyingResults: QualifyingResult[] = [];
      season?.qualifying?.MRData.RaceTable.Races.forEach(
        (race) =>
          (qualifyingResults = [
            ...qualifyingResults,
            ...race.QualifyingResults!,
          ])
      );

      return qualifyingResults;
    }
  );
  public readonly selectedResults$ = this.select(
    this.selectedSeason$,
    (season) => {
      let results: Result[] = [];
      season?.results?.MRData.RaceTable.Races.forEach(
        (race) => (results = [...results, ...race.Results!])
      );

      return results;
    }
  );
  public readonly selectedDriverStandings$ = this.select(
    this.selectedSeason$,
    (season) => {
      let driverStandings: DriverStanding[] = [];
      season?.driverStandings?.MRData.StandingsTable.StandingsLists.forEach(
        (standing) =>
          (driverStandings = [...driverStandings, ...standing.DriverStandings])
      );

      return driverStandings;
    }
  );
  public readonly selectedData$ = this.select(
    this.dataSet$,
    this.selectedDrivers$,
    this.selectedQualifyingResults$,
    this.selectedResults$,
    this.selectedDriverStandings$,
    (
      dataSet,
      selectedDrivers,
      selectedQualifyingResults,
      selectedResults,
      selectedDriverStandings
    ) => {
      let data;

      switch (dataSet) {
        case DataSets.Drivers:
          data = selectedDrivers;
          break;
        case DataSets.Qualifying:
          data = selectedQualifyingResults;
          break;
        case DataSets.Results:
          data = selectedResults;
          break;
        case DataSets.Standings:
          data = selectedDriverStandings;
          break;
      }

      return data;
    }
  );
  public readonly offset$ = this.select(
    this.dataSet$,
    this.selectedDrivers$,
    this.selectedQualifyingResults$,
    this.selectedResults$,
    this.selectedDriverStandings$,
    (
      dataSet,
      selectedDrivers,
      selectedQualifyingResults,
      selectedResults,
      selectedDriverStandings
    ) => {
      let offset = 0;

      switch (dataSet) {
        case DataSets.Drivers:
          offset = selectedDrivers!.length;
          break;
        case DataSets.Qualifying:
          offset = selectedQualifyingResults.length;
          break;
        case DataSets.Results:
          offset = selectedResults.length;
          break;
        case DataSets.Standings:
          offset = selectedDriverStandings.length;
          break;
      }

      return offset;
    }
  ).pipe(startWith(0), shareReplay());
  public readonly limit$ = this.select(
    this.offset$,
    this.currentPage$,
    this.resultsPerPage$,
    (offset, page, resultsPerPage) => {
      const pageMax = page * resultsPerPage;
      let limit = pageMax - offset;

      if (limit < 0) limit = 0;

      return limit;
    }
  ).pipe(startWith(10));
  public readonly requestConfig$ = this.select(
    this.year$,
    this.dataSet$,
    this.limit$,
    this.offset$,
    (year, dataSet, limit, offset) => ({ year, dataSet, limit, offset })
  );
  public readonly dataToDisplay$ = this.select(
    this.selectedData$,
    this.currentPage$,
    this.resultsPerPage$,
    (data, currentPage, resultsPerPage) => {
      const range = currentPage * resultsPerPage;
      const sliceStart = range - resultsPerPage;
      const sliceEnd = sliceStart + resultsPerPage;

      return data!.slice(sliceStart, sliceEnd);
    }
  );
  selectedQualifying$: any;

  constructor() {
    super(defaultState);
  }

  public readonly updateDrivers = this.updater(
    (state: SeasonsState, data: SeasonCategory<Driver[]>) => {
      const year: string = this._route.snapshot.params[RouteParams.Year];
      let { newSeasons, newSeason, newSeasonIndex } = this._cloneSeasons(
        state.seasons,
        year
      );

      if (!newSeason) {
        const seasonWithDrivers = {
          drivers: data,
          year,
        } as Season;

        return {
          ...state,
          seasons: [...state.seasons, seasonWithDrivers],
        };
      }

      let drivers = newSeason[DataSets.Drivers];

      if (!drivers) {
        drivers = data;
        newSeason = {
          ...newSeason,
          drivers,
        } as Season;
      }

      let driversData = drivers!.MRData.DriverTable!.Drivers;
      const newDriversData = data.MRData.DriverTable!.Drivers;
      driversData = [...driversData, ...newDriversData];
      newSeasons.splice(newSeasonIndex, 1, newSeason);

      return {
        ...state,
        seasons: newSeasons,
      };
    }
  );

  public readonly updateResults = this.updater(
    (state: SeasonsState, data: SeasonCategory<Race<Result>[]>) => {
      const year: string = this._route.snapshot.params[RouteParams.Year];
      let { newSeasons, newSeason, newSeasonIndex } = this._cloneSeasons(
        state.seasons,
        year
      );

      if (!newSeason) {
        const seasonWithResults = {
          results: data,
          year,
        } as Season;

        return {
          ...state,
          seasons: [...state.seasons, seasonWithResults],
        };
      }

      let results = newSeason[DataSets.Results];

      if (!results) {
        results = data;
        newSeason = {
          ...newSeason,
          results,
        } as Season;
      }

      let resultsData = results!.MRData.RaceTable!.Races;
      const newDriversData = data.MRData.RaceTable!.Races;
      resultsData = [...resultsData, ...newDriversData];
      newSeasons.splice(newSeasonIndex, 1, newSeason);

      return {
        ...state,
        seasons: newSeasons,
      };
    }
  );

  public readonly updateQualifying = this.updater(
    (state: SeasonsState, data: SeasonCategory<Race<QualifyingResult>[]>) => {
      const year: string = this._route.snapshot.params[RouteParams.Year];
      let { newSeasons, newSeason, newSeasonIndex } = this._cloneSeasons(
        state.seasons,
        year
      );

      if (!newSeason) {
        const seasonWithQualifying = {
          qualifying: data,
          year,
        } as Season;

        return {
          ...state,
          seasons: [...state.seasons, seasonWithQualifying],
        };
      }

      let qualifying = newSeason[DataSets.Qualifying];

      if (!qualifying) {
        qualifying = data;
        newSeason = {
          ...newSeason,
          qualifying,
        } as Season;
      }

      let qualifyingData = qualifying!.MRData.RaceTable!.Races;
      const newQualifyingData = data.MRData.RaceTable!.Races;
      qualifyingData = [...qualifyingData, ...newQualifyingData];
      newSeasons.splice(newSeasonIndex, 1, newSeason);

      return {
        ...state,
        seasons: newSeasons,
      };
    }
  );

  public readonly updateStandings = this.updater(
    (state: SeasonsState, data: SeasonCategory<StandingsList[]>) => {
      const year: string = this._route.snapshot.params[RouteParams.Year];
      let { newSeasons, newSeason, newSeasonIndex } = this._cloneSeasons(
        state.seasons,
        year
      );

      if (!newSeason) {
        const seasonWithStandings = {
          driverStandings: data,
          year,
        } as Season;

        return {
          ...state,
          seasons: [...state.seasons, seasonWithStandings],
        };
      }

      let driverStandings = newSeason[DataSets.Standings];

      if (!driverStandings) {
        driverStandings = data;
        newSeason = {
          ...newSeason,
          driverStandings: data,
        } as Season;
      }

      let standingsData =
        driverStandings!.MRData.StandingsTable!.StandingsLists;
      const newStandingsData = data.MRData.StandingsTable!.StandingsLists;
      standingsData = [...standingsData, ...newStandingsData];
      newSeasons.splice(newSeasonIndex, 1, newSeason);

      return {
        ...state,
        seasons: newSeasons,
      };
    }
  );

  readonly getData = (dataSet: DataSets): void => {
    switch (dataSet) {
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

// Pagination

// Display data

// Tests

// Styling

// Route Guards
