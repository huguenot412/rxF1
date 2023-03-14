export interface Season {
  drivers: SeasonData;
  results: SeasonData;
  qualifying: SeasonData;
  driverStandings: SeasonData;
  year: string;
}

export interface SeasonData {
  data: any[];
  total: number;
}
