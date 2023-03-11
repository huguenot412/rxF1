import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, combineLatest, map, switchMap } from 'rxjs';
import { ERGAST_API_BASE, RESPONSE_FORMAT, SERIES } from '../consts/ergast-api';
import { RouteParams } from '../enums/route-params';

@Injectable({
  providedIn: 'root',
})
export class SeasonsService {
  private _http = inject(HttpClient);
  private _route = inject(ActivatedRoute);
  private _season$ = this._route.params.pipe(
    map((params) => params[RouteParams.Year])
  );
  private _dataSet$ = this._route.params.pipe(
    map((params) => params[RouteParams.DataSet])
  );

  public getSeasonData(limit: number, offset: number) {
    return combineLatest([this._season$, this._dataSet$]).pipe(
      map(([season, dataSet]) => {
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
