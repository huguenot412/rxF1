import { Driver, MRData } from './seasons-response';

export interface MRDataDrivers extends MRData {
  DriverTable: DriverTable;
}

export interface DriversResponse {
  MRData: MRDataDrivers;
}

export interface DriverTable {
  season: string;
  Drivers: Driver[];
}
