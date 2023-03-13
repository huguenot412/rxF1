import { inject } from '@angular/core';
import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  ResolveFn,
  RouterStateSnapshot,
} from '@angular/router';
import { DataSets } from '../enums/data-sets';
import { SeasonsService } from '../services/seasons.service';

export const seasonsResolver: ResolveFn<any> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  // return inject(SeasonsService).getSeasonData();
};
