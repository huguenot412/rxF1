import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SeasonsService } from 'src/app/services/seasons.service';
import { DataSets } from 'src/app/models/data-sets';

@Component({
  selector: 'f1-drivers',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h1>Drivers Data</h1>
    <pre>{{ (data$ | async | json) || 'Loading...' }}</pre>
  `,
  styles: [],
})
export class DriversComponent implements OnInit {
  private seasonsService = inject(SeasonsService);
  private dataSet = DataSets.Drivers;
  public data$!: any;

  ngOnInit(): void {
    this.data$ = this.seasonsService.getSeasonData(this.dataSet);
  }
}
