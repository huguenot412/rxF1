import { QualifyingResult } from './qualifying-response';
import { Result } from './results-response';
import { Driver, Race } from './seasons-response';
import { StandingsList } from './standings-response';

export interface SeasonCategory<T> {
  total: number;
  data: T;
}

export interface Season {
  drivers: SeasonCategory<Driver[]>;
  results: SeasonCategory<Race<Result>[]>;
  qualifying: SeasonCategory<Race<QualifyingResult>[]>;
  driverStandings: SeasonCategory<StandingsList[]>;
  driversPagesMap: Map<number, Driver[]>;
  resultsPagesMap: Map<number, Race<Result>[]>;
  qualifyingPagesMap: Map<number, Race<QualifyingResult>[]>;
  standingsPagesMap: Map<number, StandingsList[]>;
  year: string;
}
