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
import { LetModule } from '@ngrx/component';

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
    LetModule,
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
          <a
            *ngIf="dataSet$ | async as dataSet"
            [routerLink]="['/seasons', season, category.key]"
            (click)="getSeasonData(dataSet)">
            {{ category.value }}
          </a>
        </li>
      </ul>
    </ng-container>
    <ng-template #seasonsEmptyState>
      <p>Choose a season</p>
    </ng-template>
    <f1-season-details
      *ngrxLet="{ selectedData: selectedDataSet$, dataSet: dataSet$} as data"
      [data]="data.selectedData"
      [dataSet]="data.dataSet"/>
    <ng-template #dataSetEmptyState>
      <p>Choose a category</p>
    </ng-template>
  `,
  styles: [],
})
export class SeasonsComponent {
  private _route = inject(ActivatedRoute);
  private _seasonsStore = inject(SeasonsStore);
  public selectedSeason$ = this._seasonsStore.selectedSeason$;
  public selectedDataSet$ = this._seasonsStore.selectedDataSet$;
  public seasons$ = this._seasonsStore.seasons$;
  public season$ = this._route.params.pipe(map((params) => params['year']));
  public dataSet$ = this._route.params.pipe(map((params) => params['dataSet']));
  public page$ = this._seasonsStore.page$;
  public limit$ = this._seasonsStore.limit$;
  public offset$ = this._seasonsStore.offset$;
  public dataSets = DataSets;
  public seasonData$: any = null;
  public categories = CATEGORIES;

  public getSeasonData(dataSet: DataSets): void {
    this.seasonData$ = this._seasonsStore.getSeasonData(dataSet);
  }
}
