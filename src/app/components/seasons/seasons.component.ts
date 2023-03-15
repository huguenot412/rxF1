import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SeasonsService } from 'src/app/services/seasons.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
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
    <ng-container *ngrxLet="{year: year$, dataSet: dataSet$} as params">
      <ul>
        <li *ngFor="let year of years$ | async">
          <a [routerLink]="['/seasons/' + year, params.dataSet || '']">{{ year }}</a>
        </li>
      </ul>
      <ng-container *ngIf="year$ | async as year; else seasonsEmptyState">
        <h1>{{ year }}</h1>
        <ul>
          <li *ngFor="let category of categories | keyvalue">
            <a
              [routerLink]="['/seasons', year, category.key]"
              (click)="getSeasonData(params.dataSet)">
              {{ category.value }}
            </a>
          </li>
        </ul>
      </ng-container>
      <ng-template #seasonsEmptyState>
        <p>Choose a season</p>
      </ng-template>
      <ng-container *ngIf="params.dataSet">
        <f1-pagination/>
        <f1-season-details/>
      </ng-container>
    </ng-container>
  `,
  styles: [``],
})
export class SeasonsComponent {
  private _seasonsStore = inject(SeasonsStore);
  private _seasonsService = inject(SeasonsService);
  public dataSet$ = this._seasonsService.dataSet$;
  public selectedSeason$ = this._seasonsStore.selectedSeason$;
  public selectedDataSet$ = this._seasonsStore.selectedCategory$;
  public selectedData$ = this._seasonsStore.selectedData$;
  public seasons$ = this._seasonsStore.seasons$;
  public year$ = this._seasonsStore.year$;
  public years$ = this._seasonsStore.years$;
  public page$ = this._seasonsStore.currentPage$;
  public limit$ = this._seasonsStore.limit$;
  public offset$ = this._seasonsStore.offset$;
  public requestConfig$ = this._seasonsStore.requestConfig$;
  public dataSets = DataSets;
  public categories = CATEGORIES;

  public getSeasonData(dataSet: DataSets): void {
    this._seasonsStore.getData(dataSet);
  }
}
