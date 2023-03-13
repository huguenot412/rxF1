import { DataSets } from '../enums/data-sets';

export interface GetSeasonsConfig {
  year: number;
  dataSet: DataSets;
  limit: number;
  offset: number;
}
