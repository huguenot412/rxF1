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
import { SeasonDetailsComponent } from '../season-details/season-details.component';
import { CATEGORIES } from 'src/app/consts/categories';

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
    SeasonDetailsComponent,
  ],
  providers: [SeasonsService, SeasonsStore],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ul>
      <li *ngFor="let season of seasons$ | async">
        <a [routerLink]="['/seasons/' + season.year, (dataSet$ | async) || '']">{{ season.year }}</a>
      </li>
    </ul>
    <ng-container *ngIf="season$ | async as season; else seasonsEmptyState">
      <h1>{{ season }}</h1>
      <ul >
        <li *ngFor="let category of categories | keyvalue">
          <a [routerLink]="['/seasons', season, category.key]" (click)="getSeasonData()">{{ category.value }}</a>
        </li>
      </ul>
    </ng-container>
    <ng-template #seasonsEmptyState>
      <p>Choose a season</p>
    </ng-template>
    <ng-container *ngIf="dataSet$ | async as dataSet; else dataSetEmptyState">
      <f1-season-details [dataSet]="seasonData$ | async"/>
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
  public selectedDataSet$ = this._seasonsStore.selectedDataSet$;
  public seasons$ = this._seasonsStore.seasons$;
  public season$ = this._route.params.pipe(map((params) => params['year']));
  public dataSet$ = this._route.params.pipe(map((params) => params['dataSet']));
  public page$ = this._seasonsStore.page$;
  public dataSets = DataSets;
  public seasonData$: any = null;
  public categories = CATEGORIES;

  public getSeasonData(): void {
    this.seasonData$ = this._seasonsService.getSeasonData();
  }
}
