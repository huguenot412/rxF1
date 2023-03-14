import { Season, SeasonData } from '../models/season';

export const EMPTY_SEASON_DATA: SeasonData = {
  data: [],
  total: 0,
};

export const SEASONS_INITIAL_STATE: Season[] = [
  {
    drivers: structuredClone(EMPTY_SEASON_DATA),
    results: structuredClone(EMPTY_SEASON_DATA),
    qualifying: structuredClone(EMPTY_SEASON_DATA),
    driverStandings: structuredClone(EMPTY_SEASON_DATA),
    year: '2018',
  },
  {
    drivers: structuredClone(EMPTY_SEASON_DATA),
    results: structuredClone(EMPTY_SEASON_DATA),
    qualifying: structuredClone(EMPTY_SEASON_DATA),
    driverStandings: structuredClone(EMPTY_SEASON_DATA),
    year: '2019',
  },
  {
    drivers: structuredClone(EMPTY_SEASON_DATA),
    results: structuredClone(EMPTY_SEASON_DATA),
    qualifying: structuredClone(EMPTY_SEASON_DATA),
    driverStandings: structuredClone(EMPTY_SEASON_DATA),
    year: '2020',
  },
  {
    drivers: structuredClone(EMPTY_SEASON_DATA),
    results: structuredClone(EMPTY_SEASON_DATA),
    qualifying: structuredClone(EMPTY_SEASON_DATA),
    driverStandings: structuredClone(EMPTY_SEASON_DATA),
    year: '2021',
  },
  {
    drivers: structuredClone(EMPTY_SEASON_DATA),
    results: structuredClone(EMPTY_SEASON_DATA),
    qualifying: structuredClone(EMPTY_SEASON_DATA),
    driverStandings: structuredClone(EMPTY_SEASON_DATA),
    year: '2022',
  },
];
