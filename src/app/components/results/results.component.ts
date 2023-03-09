import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataSets } from 'src/app/models/data-sets';
import { SeasonsService } from 'src/app/services/seasons.service';

@Component({
  selector: 'f1-results',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h1>Race Results Data</h1>
    <pre>{{ (data$ | async | json) || 'Loading...' }}</pre>
  `,
  styles: [],
})
export class ResultsComponent implements OnInit {
  private seasonsService = inject(SeasonsService);
  private dataSet = DataSets.Results;
  public data$!: any;

  ngOnInit(): void {
    this.data$ = this.seasonsService.getSeasonData(this.dataSet);
  }
}
