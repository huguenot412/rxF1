import { DataSets } from '../enums/data-sets';

export interface RequestConfig {
  year: string;
  dataSet: DataSets;
  limit: number;
  offset: number;
}
