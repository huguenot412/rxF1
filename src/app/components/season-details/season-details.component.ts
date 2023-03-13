import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataSets } from 'src/app/enums/data-sets';
import { CATEGORIES } from 'src/app/consts/categories';

@Component({
  selector: 'f1-season-details',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h1>{{ categoryName }}</h1>
    <pre>{{ (data.data | json) || 'Loading...' }}</pre>
  `,
  styles: [],
})
export class SeasonDetailsComponent {
  @Input()
  public data: any = {};
  @Input()
  public dataSet: DataSets = DataSets.Drivers;
  public categoryName = CATEGORIES.get(this.dataSet);
}
