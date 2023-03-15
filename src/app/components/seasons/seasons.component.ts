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
    <ng-container *ngrxLet="routeParams$ as params">
      <ul>
        <li *ngFor="let year of years$ | async">
          <a [routerLink]="['/seasons/' + year, params.dataSet || '']">{{ year }}</a>
        </li>
      </ul>
      <ng-container *ngIf="params.year; else seasonsEmptyState">
        <h1>{{ params.year }}</h1>
        <ul>
          <li *ngFor="let category of categories | keyvalue">
            <a
              [routerLink]="['/seasons', params.year, category.key]"
              (click)="getSeasonData(category.key)">
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
  public years$ = this._seasonsStore.years$;
  public routeParams$ = this._seasonsStore.routeParams$;
  public categories = CATEGORIES;

  public getSeasonData(dataSet: DataSets): void {
    this._seasonsStore.getData(dataSet);
  }
}
