import { Constructor, Driver, MRData, Race } from './seasons-response';

export interface MRDataQualifying extends MRData {
  RaceTable: RaceTable;
}

export interface QualifyingResponse extends MRData {
  MRData: MRDataQualifying;
}

export interface RaceTable {
  season: string;
  Races: Race<QualifyingResult>[];
}

export interface Location {
  lat: string;
  long: string;
  locality: string;
  country: string;
}

export interface QualifyingResult {
  number: string;
  position: string;
  Driver: Driver;
  Constructor: Constructor;
  Q1: string;
  Q2?: string;
  Q3?: string;
}
