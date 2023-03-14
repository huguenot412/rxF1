// Generated by https://quicktype.io

import { Constructor, Driver, MRData, Race } from './seasons-response';

export interface QualifyingResponse {
  MRData: MRData<RaceTable>;
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
