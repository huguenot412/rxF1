import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, Observable, shareReplay } from 'rxjs';
import { ERGAST_API_BASE, RESPONSE_FORMAT, SERIES } from '../consts/ergast-api';
import { RouteParams } from '../enums/route-params';
import { DriversResponse } from '../models/drivers-response';
import { RequestConfig } from '../models/request-config';
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
    shareReplay()
  );
  public dataSet$ = this._route.params.pipe(
    map((params) => params[RouteParams.DataSet]),
    shareReplay()
  );

  public getDrivers(config: RequestConfig): Observable<DriversResponse> {
    const { year, limit, offset } = config;

    return this._http.get<DriversResponse>(
      `${ERGAST_API_BASE}/${SERIES}/${year}/drivers${RESPONSE_FORMAT}?limit=${limit}&offset=${offset}`
    );
  }

  public getResults(config: RequestConfig): Observable<ResultsResponse> {
    const { year, limit, offset } = config;

    return this._http.get<ResultsResponse>(
      `${ERGAST_API_BASE}/${SERIES}/${year}/results${RESPONSE_FORMAT}?limit=${limit}&offset=${offset}`
    );
  }

  public getQualifying(config: RequestConfig): Observable<QualifyingResponse> {
    const { year, limit, offset } = config;

    return this._http.get<QualifyingResponse>(
      `${ERGAST_API_BASE}/${SERIES}/${year}/qualifying${RESPONSE_FORMAT}?limit=${limit}&offset=${offset}`
    );
  }

  public getStandings(config: RequestConfig): Observable<StandingsResponse> {
    const { year, limit, offset } = config;

    return this._http.get<StandingsResponse>(
      `${ERGAST_API_BASE}/${SERIES}/${year}/driverStandings${RESPONSE_FORMAT}?limit=${limit}&offset=${offset}`
    );
  }
}
