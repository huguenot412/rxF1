import { QualifyingResult } from '../models/qualifying-response';
import { Result } from '../models/results-response';
import { Season } from '../models/season';
import { Driver, Race } from '../models/seasons-response';
import { StandingsList } from '../models/standings-response';

export const createNewFunction = (year: string): Season => {
  return {
    drivers: {
      total: 0,
      data: [],
    },
    results: {
      total: 0,
      data: [],
    },
    qualifying: {
      total: 0,
      data: [],
    },
    driverStandings: {
      total: 0,
      data: [],
    },
    // driversPagesMap: new Map() as Map<number, Driver[]>,
    // resultsPagesMap: new Map() as Map<number, Race<Result>[]>,
    // qualifyingPagesMap: new Map() as Map<number, Race<QualifyingResult>[]>,
    // standingsPagesMap: new Map() as Map<number, StandingsList[]>,
    year: year,
  };
};
