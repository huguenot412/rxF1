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
import { DriversComponent } from '../drivers/drivers.component';
import { ResultsComponent } from '../results/results.component';
import { QualifyingComponent } from '../qualifying/qualifying.component';
import { StandingsComponent } from '../standings/standings.component';

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
      <f1-drivers *ngIf="dataSet === dataSets.Drivers"/>
      <f1-results *ngIf="dataSet === dataSets.Results"/>
      <f1-qualifying *ngIf="dataSet === dataSets.Qualifying"/>
      <f1-standings *ngIf="dataSet === dataSets.Standings"/>
    </ng-container>
    <ng-template #dataSetEmptyState>
      <p>Choose a category</p>
    </ng-template>
  `,
  styles: [],
})
export class SeasonsComponent implements OnInit {
  private _seasonsService = inject(SeasonsService);
  public route = inject(ActivatedRoute);
  public seasonData$!: Observable<any>;
  public season$ = this.route.params.pipe(map((params) => params['season']));
  public dataSet$ = this.route.params.pipe(map((params) => params['dataSet']));
  public dataSets = DataSets;

  ngOnInit(): void {
    this.season$ = this.route.params.pipe(map((params) => params['year']));
  }
}
