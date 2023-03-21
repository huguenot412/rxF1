import { Season } from '../models/season';

export const createNewSeason = (season: Partial<Season>): Season => {
  return {
    drivers: season.drivers || {
      total: 0,
      data: [],
    },
    results: season.results || {
      total: 0,
      data: [],
    },
    qualifying: season.qualifying || {
      total: 0,
      data: [],
    },
    driverStandings: season.driverStandings || {
      total: 0,
      data: [],
    },
    driversPagesMap: season.driversPagesMap || new Map([]),
    resultsPagesMap: season.resultsPagesMap || new Map([]),
    qualifyingPagesMap: season.qualifyingPagesMap || new Map([]),
    standingsPagesMap: season.standingsPagesMap || new Map([]),
    year: season.year || '2018',
  };
};
