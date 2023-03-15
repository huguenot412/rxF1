import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CATEGORIES } from 'src/app/consts/categories';
import { SeasonsStore } from 'src/app/stores/seasons-store';
import { DriversComponent } from '../drivers/drivers.component';
import { ResultsComponent } from '../results/results.component';
import { QualifyingComponent } from '../qualifying/qualifying.component';
import { StandingsComponent } from '../standings/standings.component';
import { DataSets } from 'src/app/enums/data-sets';
import { LetModule } from '@ngrx/component';

@Component({
  selector: 'f1-season-details',
  standalone: true,
  imports: [
    CommonModule,
    DriversComponent,
    ResultsComponent,
    QualifyingComponent,
    StandingsComponent,
    LetModule,
  ],
  template: `
    <ng-container *ngrxLet="dataSet$ as dataSet" [ngSwitch]="dataSet">
      <f1-drivers *ngSwitchCase="dataSets.Drivers"/>
      <f1-results *ngSwitchCase="dataSets.Results"/>
      <f1-qualifying *ngSwitchCase="dataSets.Qualifying"/>
      <f1-standings *ngSwitchCase="dataSets.Standings"/>
      <p *ngSwitchDefault>No data available</p>
    </ng-container>
  `,
  styles: [],
})
export class SeasonDetailsComponent {
  private _seasonsStore = inject(SeasonsStore);
  public data$ = this._seasonsStore.dataToDisplay$;
  public dataSet$ = this._seasonsStore.dataSet$;
  public categories = CATEGORIES;
  public dataSets = DataSets;
}
