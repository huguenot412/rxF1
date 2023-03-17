import { Constructor, Driver, MRData } from './seasons-response';

export interface MRDataStandings extends MRData {
  StandingsTable: StandingsTable;
}

export interface StandingsResponse extends MRData {
  MRData: MRDataStandings;
}

export interface StandingsTable {
  season: string;
  StandingsLists: StandingsList[];
}

export interface StandingsList {
  season: string;
  round: string;
  DriverStandings: DriverStanding[];
}

export interface DriverStanding {
  position: string;
  positionText: string;
  points: string;
  wins: string;
  Driver: Driver;
  Constructors: Constructor[];
}
