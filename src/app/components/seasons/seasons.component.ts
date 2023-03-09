import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { SeasonsService } from 'src/app/services/seasons.service';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { DataSets } from 'src/app/models/data-sets';

@Component({
  selector: 'app-seasons',
  standalone: true,
  imports: [CommonModule],
  providers: [SeasonsService],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <pre>
      {{ seasonData$ | async | json }}
    </pre
    >
  `,
  styles: [],
})
export class SeasonsComponent implements OnInit {
  private _seasonsService = inject(SeasonsService);
  private _route = inject(ActivatedRoute);
  public seasonData$!: Observable<any>;
  public season = '';

  ngOnInit(): void {
    this.season = this._route.snapshot.params['year'];
    this.seasonData$ = this._seasonsService.getSeasonData(DataSets.Results);
  }
}
