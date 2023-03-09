import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { SeasonsService } from 'src/app/services/seasons.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { map, Observable } from 'rxjs';
import { DataSets } from 'src/app/models/data-sets';

@Component({
  selector: 'app-seasons',
  standalone: true,
  imports: [CommonModule, RouterModule],
  providers: [SeasonsService],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ul>
      <li><a [routerLink]="['/seasons/2018']">2018</a></li>
      <li><a [routerLink]="['/seasons/2019']">2019</a></li>
      <li><a [routerLink]="['/seasons/2020']">2020</a></li>
      <li><a [routerLink]="['/seasons/2021']">2021</a></li>
      <li><a [routerLink]="['/seasons/2022']">2022</a></li>
    </ul>
    <h1>{{ season$ | async }}</h1>
    <ul>
      <li><a [routerLink]="['drivers']">Drivers</a></li>
      <li><a [routerLink]="['results']">Race Results</a></li>
      <li><a [routerLink]="['qualifying']">Qualifying Results</a></li>
      <li><a [routerLink]="['standings']">Driver Standings</a></li>
    </ul>
    <router-outlet></router-outlet>
  `,
  styles: [],
})
export class SeasonsComponent implements OnInit {
  private _seasonsService = inject(SeasonsService);
  private _route = inject(ActivatedRoute);
  public seasonData$!: Observable<any>;
  public season$!: Observable<string | null>;

  ngOnInit(): void {
    this.season$ = this._route.params.pipe(map((params) => params['year']));
    this.seasonData$ = this._seasonsService.getSeasonData(DataSets.Results);
  }
}
