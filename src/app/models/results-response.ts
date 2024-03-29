import { Constructor, Driver, MRData, Race } from './seasons-response';

export interface MRDataResults extends MRData {
  RaceTable: RaceTable;
}

export interface ResultsResponse extends MRData {
  MRData: MRDataResults;
}

export interface RaceTable {
  season: string;
  Races: Race<Result>[];
}

export interface Location {
  lat: string;
  long: string;
  locality: string;
  country: string;
}

export interface Result {
  number: string;
  position: string;
  positionText: string;
  points: string;
  Driver: Driver;
  Constructor: Constructor;
  grid: string;
  laps: string;
  status: string;
  Time?: ResultTime;
  FastestLap?: FastestLap;
}

export interface FastestLap {
  rank: string;
  lap: string;
  Time: FastestLapTime;
  AverageSpeed: AverageSpeed;
}

export interface AverageSpeed {
  units: Units;
  speed: string;
}

export enum Units {
  Kph = 'kph',
}

export interface FastestLapTime {
  time: string;
}

export interface ResultTime {
  millis: string;
  time: string;
}
