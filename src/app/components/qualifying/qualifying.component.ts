import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SeasonsService } from 'src/app/services/seasons.service';
import { DataSets } from 'src/app/models/data-sets';

@Component({
  selector: 'f1-qualifying',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h1>Qualifying Results Data</h1>
    <pre>{{ (data$ | async | json) || 'Loading...' }}</pre>
  `,
  styles: [],
})
export class QualifyingComponent implements OnInit {
  private seasonsService = inject(SeasonsService);
  private dataSet = DataSets.Qualifying;
  public data$!: any;

  ngOnInit(): void {
    this.data$ = this.seasonsService.getSeasonData(this.dataSet);
  }
}
