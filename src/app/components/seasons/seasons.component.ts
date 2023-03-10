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
import { DataSets } from 'src/app/enums/data-sets';
import { DriversComponent } from '../drivers/drivers.component';
import { ResultsComponent } from '../results/results.component';
import { QualifyingComponent } from '../qualifying/qualifying.component';
import { StandingsComponent } from '../standings/standings.component';
import { SeasonsStore } from 'src/app/stores/seasons-store';

@Component({
  selector: 'app-seasons',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    DriversComponent,
    ResultsComponent,
    QualifyingComponent,
    StandingsComponent,
  ],
  providers: [SeasonsService, SeasonsStore],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ul>
      <li><a [routerLink]="['/seasons/2018', (dataSet$ | async) || '']">2018</a></li>
      <li><a [routerLink]="['/seasons/2019', (dataSet$ | async) || '']">2019</a></li>
      <li><a [routerLink]="['/seasons/2020', (dataSet$ | async) || '']">2020</a></li>
      <li><a [routerLink]="['/seasons/2021', (dataSet$ | async) || '']">2021</a></li>
      <li><a [routerLink]="['/seasons/2022', (dataSet$ | async) || '']">2022</a></li>
    </ul>
    <ng-container *ngIf="season$ | async as season; else seasonsEmptyState">
      <h1>{{ season }}</h1>
      <ul >
        <li><a [routerLink]="['/seasons', season, dataSets.Drivers]">Drivers</a></li>
        <li><a [routerLink]="['/seasons', season, dataSets.Results]">Race Results</a></li>
        <li><a [routerLink]="['/seasons', season, dataSets.Qualifying]">Qualifying Results</a></li>
        <li><a [routerLink]="['/seasons', season, dataSets.Standings]">Driver Standings</a></li>
      </ul>
    </ng-container>
    <ng-template #seasonsEmptyState>
      <p>Choose a season</p>
    </ng-template>
    <ng-container *ngIf="dataSet$ | async as dataSet; else dataSetEmptyState">
      <f1-drivers *ngIf="dataSet === dataSets.Drivers" [dataSet]="selectedSeasonDrivers$ | async"/>
      <f1-results *ngIf="dataSet === dataSets.Results" [dataSet]="selectedSeasonResults$ | async"/>
      <f1-qualifying *ngIf="dataSet === dataSets.Qualifying" [dataSet]="selectedSeasonQualifying$ | async"/>
      <f1-standings *ngIf="dataSet === dataSets.Standings" [dataSet]="selectedSeasonStandings$ | async"/>
    </ng-container>
    <ng-template #dataSetEmptyState>
      <p>Choose a category</p>
    </ng-template>
  `,
  styles: [],
})
export class SeasonsComponent {
  private _route = inject(ActivatedRoute);
  private _seasonsService = inject(SeasonsService);
  private _seasonsStore = inject(SeasonsStore);
  public selectedSeason$ = this._seasonsStore.selectedSeason$;
  public selectedSeasonDrivers$ = this._seasonsStore.selectedSeasonDrivers$;
  public selectedSeasonResults$ = this._seasonsStore.selectedSeasonResults$;
  public selectedSeasonQualifying$ =
    this._seasonsStore.selectedSeasonQualifying$;
  public selectedSeasonStandings$ = this._seasonsStore.selectedSeasonStandings$;
  public season$ = this._route.params.pipe(map((params) => params['year']));
  public dataSet$ = this._route.params.pipe(map((params) => params['dataSet']));
  public page$ = this._seasonsStore.page$;
  public dataSets = DataSets;
}
