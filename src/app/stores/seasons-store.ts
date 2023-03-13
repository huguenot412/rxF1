import { inject, Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { map, Observable, switchMap } from 'rxjs';
import { SEASONS_INITIAL_STATE } from '../consts/seasons-initial-state';
import { DataSets } from '../enums/data-sets';
import { RouteParams } from '../enums/route-params';
import { GetSeasonsConfig } from '../models/get-seasons-config';
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
  seasons: SEASONS_INITIAL_STATE,
  limit: 10,
  offset: 0,
  page: 1,
};

@Injectable()
export class SeasonsStore extends ComponentStore<SeasonsState> {
  private readonly _route = inject(ActivatedRoute);
  private readonly _seasonsService = inject(SeasonsService);
  public readonly year$ = this._route.params.pipe(
    map((params) => params['year'])
  );
  public readonly dataSet$ = this._route.params.pipe(
    map((params) => params['dataSet'])
  );
  public readonly seasons$ = this.select(({ seasons }) => seasons);
  public readonly selectedSeason$ = this.select(
    this.seasons$,
    this.year$,
    (seasons, year) => seasons.find((season) => season.year == year)
  );
  public readonly selectedDataSet$ = this.select(
    this.selectedSeason$,
    this.dataSet$,
    (season, dataSet: DataSets) => (season ? season[dataSet] : null)
  );
  public readonly totalResults$ = this.select(
    this.selectedDataSet$,
    (data) => data.total || 0
  );
  public readonly limit$ = this.select(({ limit }) => limit);
  public readonly offset$ = this.select(({ offset }) => offset);
  public readonly currentPage$ = this.select(({ page }) => page);
  public readonly pagesCount$ = this.select(
    this.totalResults$,
    this.limit$,
    (total, limit) => Math.ceil(total / limit)
  );
  public readonly pages$ = this.select(this.pagesCount$, (pageCount) =>
    [...Array(pageCount).keys()].map((num) => num + 1)
  );
  public readonly getDataConfig$ = this.select(
    this.year$,
    this.dataSet$,
    this.limit$,
    this.offset$,
    (year, dataSet, limit, offset) => ({ year, dataSet, limit, offset })
  );
  public readonly paginationConfig$ = this.select(
    this.currentPage$,
    this.limit$,
    this.totalResults$,
    (currentPage, limit, total) => ({ currentPage, limit, total })
  );

  constructor() {
    super(defaultState);
  }

  public readonly updateSeason = this.updater(
    (state: SeasonsState, data: any) => {
      const year: string = this._route.snapshot.params[RouteParams.Year];
      const dataSet: DataSets =
        this._route.snapshot.params[RouteParams.DataSet];
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

  readonly getSeasonData = this.effect(
    (getDataConfig$: Observable<GetSeasonsConfig>) => {
      return getDataConfig$.pipe(
        switchMap((config) =>
          this._seasonsService.getSeasonData(config).pipe(
            tapResponse(
              (data) => this.updateSeason(data),
              (error) => console.log(error)
            )
          )
        )
      );
    }
  );
}

// Pagination

// Display data

// Tests

// Styling

// Route Guards
