import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataSets } from 'src/app/enums/data-sets';
import { CATEGORIES } from 'src/app/consts/categories';
import { SeasonsStore } from 'src/app/stores/seasons-store';

@Component({
  selector: 'f1-season-details',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h1>{{ categories.get(dataSet$ | async) }}</h1>
    <pre>{{ (data$ | async | json) || 'Loading...' }}</pre>
  `,
  styles: [],
})
export class SeasonDetailsComponent {
  private _seasonsStore = inject(SeasonsStore);
  public data$ = this._seasonsStore.dataToDisplay$;
  public dataSet$ = this._seasonsStore.dataSet$;
  public categories = CATEGORIES;
}
