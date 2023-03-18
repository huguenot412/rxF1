import { DataSets } from '../enums/data-sets';

export interface RequestConfig {
  year: number;
  dataSet: DataSets;
  limit: number;
  offset: number;
}
