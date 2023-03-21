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
import { CATEGORIES } from 'src/app/consts/categories';
import { LetModule } from '@ngrx/component';
import { PaginationComponent } from '../pagination/pagination.component';
import {
  MatDrawerContainer,
  MatSidenavModule,
} from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';

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
    PaginationComponent,
    LetModule,
    MatSidenavModule,
    MatListModule,
  ],
  providers: [SeasonsService, SeasonsStore, MatDrawerContainer],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng-container *ngrxLet="{config: requestConfig$, params: routeParams$} as vm">
      <mat-drawer-container class="drawer-container">
        <mat-drawer mode="side" opened>
          <div mat-subheader>Seasons</div>
          <mat-nav-list>
            <a mat-list-item *ngFor="let year of years$ | async" [activated]="year === vm.config.year" [routerLink]="['/seasons/' + year, vm.config.dataSet || '']">{{ year }}</a>
          </mat-nav-list>
          <ng-container *ngIf="vm.config.year">
            <mat-divider></mat-divider>
            <div mat-subheader>Categories</div>
            <mat-nav-list>
              <a
                *ngFor="let category of categories | keyvalue"
                mat-list-item
                  [routerLink]="['/seasons', vm.config.year, category.key]"
                  (click)="changeCategory()">
                  {{ category.value }}
              </a>
            </mat-nav-list>
          </ng-container>
        </mat-drawer>
      <mat-drawer-content class="drawer-content">
        <h1>{{ (vm.config.year || '') + " " + (categories.get(vm.config.dataSet) || '')}}</h1>
        <p *ngIf="!vm.config.year">Choose a season</p>
        <f1-pagination *ngIf="vm.config.year && vm.config.dataSet"/>
        <ng-container [ngSwitch]="vm.config.dataSet" *ngIf="vm.config.year">
          <f1-drivers *ngSwitchCase="dataSets.Drivers"/>
          <f1-results *ngSwitchCase="dataSets.Results"/>
          <f1-qualifying *ngSwitchCase="dataSets.Qualifying"/>
          <f1-standings *ngSwitchCase="dataSets.Standings"/>
          <p *ngSwitchDefault>Choose a category</p>
        </ng-container>
      </mat-drawer-content>
      </mat-drawer-container>
    </ng-container>
  `,
  styles: [
    `
      .drawer-container {
        min-height: 100vh;
        width: 100vw;
      }

      .drawer-content {
        padding: 1rem;
      }

      [mat-subheader] {
        font-weight: 600;
      }
    `,
  ],
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
