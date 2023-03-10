import { inject, Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ComponentStore } from '@ngrx/component-store';
import {
  catchError,
  EMPTY,
  map,
  Observable,
  switchMap,
  tap,
  withLatestFrom,
} from 'rxjs';
import { DataSets } from '../enums/data-sets';
import { Season } from '../models/season';
import { SeasonsService } from '../services/seasons.service';

export interface SeasonsState {
  seasons: Season[];
  limit: number;
  offset: number;
  page: number;
}

export interface SeasonUpdaterConfig {
  season: string;
  dataSet: DataSets;
  data: any;
}

const defaultState: SeasonsState = {
  seasons: [
    {
      drivers: {},
      results: {},
      qualifying: {},
      driverStandings: {},
      year: '2018',
    },
    {
      drivers: {},
      results: {},
      qualifying: {},
      driverStandings: {},
      year: '2019',
    },
    {
      drivers: {},
      results: {},
      qualifying: {},
      driverStandings: {},
      year: '2020',
    },
    {
      drivers: {},
      results: {},
      qualifying: {},
      driverStandings: {},
      year: '2021',
    },
    {
      drivers: {},
      results: {},
      qualifying: {},
      driverStandings: {},
      year: '2022',
    },
  ],
  limit: 10,
  offset: 0,
  page: 1,
};

@Injectable()
export class SeasonsStore extends ComponentStore<SeasonsState> {
  private readonly _route = inject(ActivatedRoute);
  private readonly _seasonsService = inject(SeasonsService);
  private readonly _season$ = this._route.params.pipe(
    map((params) => params['season'])
  );
  private readonly _dataSet$ = this._route.params.pipe(
    map((params) => params['dataSet'])
  );
  public readonly seasons$ = this.select(({ seasons }) => seasons);
  public readonly selectedSeason$ = this.select(
    this.seasons$,
    this._season$,
    (seasons, year) => seasons.find((season) => season.year === year)
  );
  public readonly selectedDataSet$ = this.select(
    this.selectedSeason$,
    this._dataSet$,
    (season, dataSet: DataSets) => (season ? season[dataSet] : null)
  );
  public readonly limit$ = this.select(({ limit }) => limit);
  public readonly offset$ = this.select(({ offset }) => offset);
  public readonly page$ = this.select(({ page }) => page);

  constructor() {
    super(defaultState);
  }

  public readonly updateSeason = this.updater(
    (state: SeasonsState, data: any) => {
      const year: string = this._route.snapshot.params['year'];
      const dataSet: DataSets = this._route.snapshot.params['dataSet'];
      const newSeasons: Season[] = structuredClone(state.seasons);
      const newSeason = newSeasons.find((item: Season) => item.year === year);
      const newSeasonIndex = newSeasons.findIndex(
        (item: Season) => item.year === year
      );

      newSeason![dataSet] = data;
      newSeasons.splice(newSeasonIndex, 1, newSeason!);

      return {
        ...state,
        seasons: newSeasons,
      };
    }
  );

  readonly getSeasonData = this.effect((dataSet$: Observable<DataSets>) => {
    return dataSet$.pipe(
      withLatestFrom(this.limit$, this.offset$),
      switchMap(([, limit, offset]) =>
        this._seasonsService.getSeasonData(limit, offset).pipe(
          tap({
            next: (data) => this.updateSeason(data),
            error: (e) => console.log(e),
          }),
          catchError(() => EMPTY)
        )
      )
    );
  });
}

// TODO: Determine how best to fetch dataSet, update it in Store and pass it to components.
// Resolver? Store Effects?

// Pagination

// Display data

// Tests

// Styling
