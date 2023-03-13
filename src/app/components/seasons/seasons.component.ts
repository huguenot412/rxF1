import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SeasonsService } from 'src/app/services/seasons.service';
import { RouterModule } from '@angular/router';
import { DataSets } from 'src/app/enums/data-sets';
import { DriversComponent } from '../drivers/drivers.component';
import { ResultsComponent } from '../results/results.component';
import { QualifyingComponent } from '../qualifying/qualifying.component';
import { StandingsComponent } from '../standings/standings.component';
import { SeasonsStore } from 'src/app/stores/seasons-store';
import { SeasonDetailsComponent } from '../season-details/season-details.component';
import { CATEGORIES } from 'src/app/consts/categories';
import { LetModule } from '@ngrx/component';
import { PaginationComponent } from '../pagination/pagination.component';

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
    PaginationComponent,
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
        <ul>
          <li *ngFor="let category of categories | keyvalue">
            <a
              *ngrxLet="dataSet$ as dataSet"
              [routerLink]="['/seasons', season, category.key]"
              (click)="getSeasonData()">
              {{ category.value }}
            </a>
          </li>
        </ul>
      </ng-container>
      <ng-template #seasonsEmptyState>
        <p>Choose a season</p>
      </ng-template>
      <ng-container *ngIf="dataSet$ | async as dataSet">
        <f1-pagination/>
        <f1-season-details/>
      </ng-container>

      <ng-container *ngrxLet="{
        state: state$,
        selectedSeason: selectedSeason$,
        selectedDataSet: selectedDataSet$,
        selectedData: selectedData$
      }"></ng-container>
  `,
  styles: [``],
})
export class SeasonsComponent {
  private _seasonsStore = inject(SeasonsStore);
  public state$ = this._seasonsStore.everything$;
  public selectedSeason$ = this._seasonsStore.selectedSeason$;
  public selectedDataSet$ = this._seasonsStore.selectedDataSet$;
  public selectedData$ = this._seasonsStore.selectedData$;
  public seasons$ = this._seasonsStore.seasons$;
  public season$ = this._seasonsStore.year$;
  public dataSet$ = this._seasonsStore.dataSet$;
  public page$ = this._seasonsStore.currentPage$;
  public limit$ = this._seasonsStore.limit$;
  public offset$ = this._seasonsStore.offset$;
  public getDataConfig$ = this._seasonsStore.getDataConfig$;
  public dataSets = DataSets;
  public categories = CATEGORIES;

  public getSeasonData(): void {
    this._seasonsStore.getSeasonData(this.getDataConfig$);
  }
}
