import { inject, Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ComponentStore } from '@ngrx/component-store';
import { map } from 'rxjs';
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
      standings: {},
      year: '2018',
    },
    {
      drivers: {},
      results: {},
      qualifying: {},
      standings: {},
      year: '2019',
    },
    {
      drivers: {},
      results: {},
      qualifying: {},
      standings: {},
      year: '2020',
    },
    {
      drivers: {},
      results: {},
      qualifying: {},
      standings: {},
      year: '2021',
    },
    {
      drivers: {},
      results: {},
      qualifying: {},
      standings: {},
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
  public readonly season$ = this._route.params.pipe(
    map((params) => params['season'])
  );
  public readonly dataSet$ = this._route.params.pipe(
    map((params) => params['dataSet'])
  );
  public readonly seasons$ = this.select(({ seasons }) => seasons);
  public readonly selectedSeason$ = this.select(
    this.seasons$,
    this.season$,
    (seasons, year) => seasons.find((season) => season.year === year)
  );
  public readonly selectedSeasonDrivers$ = this.select(
    this.selectedSeason$,
    (season) => season?.drivers
  );
  public readonly selectedSeasonResults$ = this.select(
    this.selectedSeason$,
    (season) => season?.results
  );
  public readonly selectedSeasonQualifying$ = this.select(
    this.selectedSeason$,
    (season) => season?.qualifying
  );
  public readonly selectedSeasonStandings$ = this.select(
    this.selectedSeason$,
    (season) => season?.standings
  );
  public readonly limit$ = this.select(({ limit }) => limit);
  public readonly offset$ = this.select(({ offset }) => offset);
  public readonly page$ = this.select(({ page }) => page);

  constructor() {
    super(defaultState);
  }
}
