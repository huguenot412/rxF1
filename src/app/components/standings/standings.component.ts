import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { SeasonsStore } from 'src/app/stores/seasons-store';

@Component({
  selector: 'f1-standings',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h1>Standings Data</h1>
    <pre>{{ driverStandings$ | async | json }}</pre>
  `,
  styles: [],
})
export class StandingsComponent {
  private _seasonsStore = inject(SeasonsStore);
  public driverStandings$ = this._seasonsStore.dataToDisplay$;
}
