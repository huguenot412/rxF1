import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import { ERGAST_API_BASE, RESPONSE_FORMAT, SERIES } from '../consts/ergast-api';
import { DataSets } from '../enums/data-sets';
import { RouteParams } from '../enums/route-params';
import { GetSeasonsConfig } from '../models/get-seasons-config';
import { SeasonData } from '../models/season';

@Injectable({
  providedIn: 'root',
})
export class SeasonsService {
  private _http = inject(HttpClient);
  private _route = inject(ActivatedRoute);

  public getSeasonData(config: GetSeasonsConfig) {
    const { limit, offset } = config;
    const year = this._route.snapshot.params[RouteParams.Year];
    const dataSet = this._route.snapshot.params[RouteParams.DataSet];

    return this._http
      .get<SeasonData>(
        `${ERGAST_API_BASE}/${SERIES}/${year}/${dataSet}${RESPONSE_FORMAT}?limit=${limit}&offset=${offset}`
      )
      .pipe(
        map((data: any) => {
          let results: SeasonData = {
            data: [],
            total: data.MRData.total,
          };

          switch (dataSet) {
            case DataSets.Drivers:
              results.data = data.MRData.DriverTable.Drivers;
              break;
            case DataSets.Standings:
              results.data =
                data.MRData.StandingsTable.StandingsLists[0].DriverStandings;
              break;
            case DataSets.Qualifying:
              results.data = data.MRData.RaceTable.Races[0].QualifyingResults;
              break;
            case DataSets.Results:
              results.data = data.MRData.RaceTable.Races;
              break;
          }

          return results;
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
