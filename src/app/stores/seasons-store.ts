import { inject, Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ComponentStore } from '@ngrx/component-store';
import { map } from 'rxjs';
import { DataSets } from '../enums/data-sets';
import { Season } from '../models/season';

export interface SeasonsState {
  seasons: Season[];
  limit: number;
  offset: number;
  page: number;
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
}

// TODO: Determine how best to fetch dataSet, update it in Store and pass it to components.
// Resolver? Store Effects?

// Pagination

// Display data

// Tests

// Styling
