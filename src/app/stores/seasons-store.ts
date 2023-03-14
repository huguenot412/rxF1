import { inject, Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { exhaustMap, map, Observable, switchMap, tap } from 'rxjs';
import { DataSets } from '../enums/data-sets';
import { RouteParams } from '../enums/route-params';
import { DriversResponse } from '../models/drivers-response';
import { GetSeasonsConfig } from '../models/get-seasons-config';
import { Season } from '../models/season';
import { SeasonsService } from '../services/seasons.service';

export interface SeasonsState {
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
  public readonly everything$ = this.select((state) => state);
  public readonly year$ = this._seasonsService.year$;
  public readonly dataSet$ = this._seasonsService.dataSet$;
  // Make service one source of truth for route params observable and make sure they are subscribed to in template
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
    (data) => data?.total || 0
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
  public readonly selectedData$ = this.select(
    this.selectedDataSet$,
    this.dataSet$,
    (selectedDataSet, dataSet) => {
      if (!selectedDataSet || !selectedDataSet.data) return [];

      if (dataSet === DataSets.Results) return selectedDataSet.data[0].Results;

      return selectedDataSet.data;
    }
  );
  public readonly offset$ = this.select(
    this.selectedData$,
    (data) => data.length
  );
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
  );
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

      return data.slice(sliceStart, sliceEnd);
    }
  );

  constructor() {
    super(defaultState);
  }

  // public readonly updateSeason = this.updater(
  //   (state: SeasonsState, seasonData: SeasonData) => {
  //     const year: string = this._route.snapshot.params[RouteParams.Year];
  //     const dataSet: DataSets =
  //       this._route.snapshot.params[RouteParams.DataSet];
  //     const newSeasons: Season[] = structuredClone(state.seasons);
  //     const newSeason = newSeasons.find((item: Season) => item.year === year);
  //     const newSeasonIndex = newSeasons.findIndex(
  //       (item: Season) => item.year === year
  //     );

  //     if (!newSeason) return { ...state };

  //     const newSeasonCategory = newSeason[dataSet];
  //     newSeasonCategory.data = [...newSeasonCategory.data, ...seasonData.data];
  //     newSeasonCategory.total = seasonData.total;
  //     newSeasons.splice(newSeasonIndex, 1, newSeason);

  //     return {
  //       ...state,
  //       seasons: newSeasons,
  //     };
  //   }
  // );

  public readonly updateDrivers = this.updater(
    (state: SeasonsState, data: DriversResponse) => {
      const year: string = this._route.snapshot.params[RouteParams.Year];
      const { newSeasons, newSeason, newSeasonIndex } = this._cloneSeasons(
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

      const newSeasonCategory = newSeason[DataSets.Drivers];
      let driversData = newSeasonCategory!.MRData.DriverTable!.Drivers;
      const newDriversData = data.MRData.DriverTable!.Drivers;
      driversData = [...driversData, ...newDriversData];
      newSeasons.splice(newSeasonIndex, 1, newSeason);

      return {
        ...state,
        seasons: newSeasons,
      };
    }
  );

  readonly getDrivers = this.effect(
    (requestConfig$: Observable<GetSeasonsConfig>) => {
      return getDataConfig$.pipe(
        exhaustMap((config) =>
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
