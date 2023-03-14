import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, Observable, share } from 'rxjs';
import { ERGAST_API_BASE, RESPONSE_FORMAT, SERIES } from '../consts/ergast-api';
import { RouteParams } from '../enums/route-params';
import { DriversResponse } from '../models/drivers-response';
import { GetSeasonsConfig } from '../models/get-seasons-config';
import { QualifyingResponse } from '../models/qualifying-response';
import { ResultsResponse } from '../models/results-response';
import { StandingsResponse } from '../models/standings-response';

@Injectable({
  providedIn: 'root',
})
export class SeasonsService {
  private _http = inject(HttpClient);
  private _route = inject(ActivatedRoute);
  public year$ = this._route.params.pipe(
    map((params) => params[RouteParams.Year]),
    share()
  );
  public dataSet$ = this._route.params.pipe(
    map((params) => params[RouteParams.DataSet]),
    share()
  );

  public getDrivers(config: GetSeasonsConfig): Observable<DriversResponse> {
    const { year, limit, offset } = config;

    return this._http.get<DriversResponse>(
      `${ERGAST_API_BASE}/${SERIES}/${year}/drivers${RESPONSE_FORMAT}?limit=${limit}&offset=${offset}`
    );
  }

  public getResults(config: GetSeasonsConfig): Observable<ResultsResponse> {
    const { year, limit, offset } = config;

    return this._http.get<ResultsResponse>(
      `${ERGAST_API_BASE}/${SERIES}/${year}/results${RESPONSE_FORMAT}?limit=${limit}&offset=${offset}`
    );
  }

  public getQualifying(
    config: GetSeasonsConfig
  ): Observable<QualifyingResponse> {
    const { year, limit, offset } = config;

    return this._http.get<QualifyingResponse>(
      `${ERGAST_API_BASE}/${SERIES}/${year}/qualifying${RESPONSE_FORMAT}?limit=${limit}&offset=${offset}`
    );
  }

  public getStandings(config: GetSeasonsConfig): Observable<StandingsResponse> {
    const { year, limit, offset } = config;

    return this._http.get<StandingsResponse>(
      `${ERGAST_API_BASE}/${SERIES}/${year}/driverStandings${RESPONSE_FORMAT}?limit=${limit}&offset=${offset}`
    );
  }
}

// List of Drivers per season.
// http://ergast.com/api/f1/{{year}}/drivers

// List of Races per season with final results.
// http://ergast.com/api/f1/{{year}}/{{round}}/results

// Qualifying Results per race in every single season.
// http://ergast.com/api/f1/{{year}}/{{round}}/qualifying

// Driver Standings after a race.
// http://ergast.com/api/f1/{{year}}/{{round}}/driverStandings

// BONUS:
//     How many cars "Finished".
//     How many cars had an "Accident".
//     How many cars finished +1 Lap.

// BONUS:
//     How many cars "Finished".
//     How many cars had an "Accident".
//     How many cars finished +1 Lap.

// Add number to items to show in pagination:

//     10
//     15
//     25
