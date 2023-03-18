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
    <ng-container *ngrxLet="{config: requestConfig$, params: routeParams$} as vm">
      <ul>
        <li *ngFor="let year of years$ | async">
          <a [routerLink]="['/seasons/' + year, vm.config.dataSet || '']">{{ year }}</a>
        </li>
      </ul>
      <ng-container *ngIf="vm.config.year; else seasonsEmptyState">
        <h1>{{ vm.config.year }}</h1>
        <ul>
          <li *ngFor="let category of categories | keyvalue">
            <a
              [routerLink]="['/seasons', vm.config.year, category.key]"
              (click)="changeCategory()">
              {{ category.value }}
            </a>
          </li>
        </ul>
      </ng-container>
      <ng-template #seasonsEmptyState>
        <p>Choose a season</p>
      </ng-template>
      <ng-container [ngSwitch]="vm.config.dataSet">
        <f1-pagination/>
        <f1-drivers *ngSwitchCase="dataSets.Drivers"/>
        <f1-results *ngSwitchCase="dataSets.Results"/>
        <f1-qualifying *ngSwitchCase="dataSets.Qualifying"/>
        <f1-standings *ngSwitchCase="dataSets.Standings"/>
        <p *ngSwitchDefault>No data available</p>
      </ng-container>
    </ng-container>
  `,
  styles: [``],
})
export class SeasonsComponent {
  private _seasonsStore = inject(SeasonsStore);
  public years$ = this._seasonsStore.years$;
  public routeParams$ = this._seasonsStore.routeParams$;
  public requestConfig$ = this._seasonsStore.requestConfig$;
  public categories = CATEGORIES;
  public dataSets = DataSets;

  public changeCategory(): void {
    this._seasonsStore.patchState({ currentPage: 1 });
  }
}
