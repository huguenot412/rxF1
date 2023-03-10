import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  BehaviorSubject,
  combineLatest,
  forkJoin,
  map,
  Observable,
  switchMap,
} from 'rxjs';
import { ERGAST_API_BASE, RESPONSE_FORMAT, SERIES } from '../consts/ergast-api';
import { DataSets } from '../enums/data-sets';

const INITIAL_STATE = {
  season2018: {
    drivers: {},
    results: {},
    qualifying: {},
    standings: {},
  },
  season2019: {
    drivers: {},
    results: {},
    qualifying: {},
    standings: {},
  },
  season2020: {
    drivers: {},
    results: {},
    qualifying: {},
    standings: {},
  },
  season2021: {
    drivers: {},
    results: {},
    qualifying: {},
    standings: {},
  },
  season2022: {
    drivers: {},
    results: {},
    qualifying: {},
    standings: {},
  },
};

@Injectable({
  providedIn: 'root',
})
export class SeasonsService {
  private _http = inject(HttpClient);
  private _route = inject(ActivatedRoute);
  private _season$ = this._route.params.pipe(map((params) => params['year']));
  private _dataSet$ = this._route.params.pipe(
    map((params) => params['dataSet'])
  );
  private _limit$ = new BehaviorSubject(10);
  private _offset$ = new BehaviorSubject(0);
  private _page$ = new BehaviorSubject(1);
  private _seasonsState$ = new BehaviorSubject(INITIAL_STATE);
  public limit$ = this._limit$.asObservable();
  public offset$ = this._offset$.asObservable();

  public getSeasonData() {
    return combineLatest([
      this._season$,
      this._dataSet$,
      this._limit$,
      this._offset$,
    ]).pipe(
      switchMap(([season, dataSet, limit, offset]) => {
        return this._http.get(
          `${ERGAST_API_BASE}/${SERIES}/${season}/${dataSet}${RESPONSE_FORMAT}?limit=${limit}&offset=${offset}`
        );
      })
    );
    // return {
    //   drivers: 'drivers',
    //   results: 'results',
    //   qualifying: 'qualifying',
    //   standings: 'standings',
    // };
  }
}

// Drivers
// Race Results
// Qualifying Results
// Driver Standings

// BONUS:
//     How many cars "Finished".
//     How many cars had an "Accident".
//     How many cars finished +1 Lap.

// Add number to items to show in pagination:

//     10
//     15
//     25
