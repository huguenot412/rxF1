import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {
  BehaviorSubject,
  combineLatest,
  forkJoin,
  map,
  Observable,
  switchMap,
} from 'rxjs';
import { ERGAST_API_BASE, RESPONSE_FORMAT, SERIES } from '../consts/ergast-api';
import { DataSets } from '../models/data-sets';

@Injectable()
export class SeasonsService {
  private _http = inject(HttpClient);
  private _season$ = new BehaviorSubject('2018');
  private _limit$ = new BehaviorSubject(10);
  private _offset$ = new BehaviorSubject(0);
  public limit$ = this._limit$.asObservable();
  public offset$ = this._offset$.asObservable();

  public getSeasonData(dataSet: DataSets) {
    return combineLatest([this._season$, this._limit$, this._offset$]).pipe(
      switchMap(([season, limit, offset]) => {
        return this._http.get(
          `${ERGAST_API_BASE}/${SERIES}/${season}/${dataSet}${RESPONSE_FORMAT}?limit=${limit}&offset=${offset}`
        );
      })
    );
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
