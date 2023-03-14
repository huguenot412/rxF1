import { DriversResponse } from './drivers-response';
import { QualifyingResponse } from './qualifying-response';
import { ResultsResponse } from './results-response';
import { StandingsResponse } from './standings-response';

export interface Season {
  drivers: DriversResponse;
  results: ResultsResponse;
  qualifying: QualifyingResponse;
  driverStandings: StandingsResponse;
  year: string;
}
