// Generated by https://quicktype.io

import { Driver, MRData } from './seasons-response';

export interface DriversResponse {
  MRData: MRData<DriverTable>;
}

export interface DriverTable {
  season: string;
  Drivers: Driver[];
}