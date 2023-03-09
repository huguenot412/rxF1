import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataSets } from 'src/app/models/data-sets';
import { SeasonsService } from 'src/app/services/seasons.service';

@Component({
  selector: 'f1-standings',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h1>Standings Data</h1>
    <pre>{{ (data$ | async | json) || 'Loading...' }}</pre>
  `,
  styles: [],
})
export class StandingsComponent implements OnInit {
  private seasonsService = inject(SeasonsService);
  private dataSet = DataSets.Standings;
  public data$!: any;

  ngOnInit(): void {
    this.data$ = this.seasonsService.getSeasonData(this.dataSet);
  }
}
