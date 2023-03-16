import { DriversResponse } from './drivers-response';
import { QualifyingResponse, QualifyingResult } from './qualifying-response';
import { Result, ResultsResponse } from './results-response';
import { Driver, Race } from './seasons-response';
import {
  DriverStanding,
  StandingsList,
  StandingsResponse,
} from './standings-response';

export interface SeasonCategory<T> {
  total: number;
  data: T;
}

export interface Season {
  drivers?: SeasonCategory<Driver[]>;
  results?: SeasonCategory<Race<Result>[]>;
  qualifying?: SeasonCategory<Race<QualifyingResult>[]>;
  driverStandings?: SeasonCategory<StandingsList[]>;
  year: string;
}
