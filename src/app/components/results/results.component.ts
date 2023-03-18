import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SeasonsStore } from 'src/app/stores/seasons-store';

@Component({
  selector: 'f1-results',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h1>Race Results</h1>
    <h2>Totals (from currently displayed results)</h2>
    <p>Finished: {{ totalFinished$ | async }}</p>
    <p>Accidents: {{ totalAccident$ | async }}</p>
    <p>+1 Lap: {{ totalPlus1$ | async }}</p>
    <div *ngFor="let race of results$ | async">
      <h3>Round: {{ race.round }}</h3>
      <table>
        <th>Position</th>
        <th>Driver</th>
        <th>Nationality</th>
        <th>Number</th>
        <th>Constructor</th>
        <th>Points</th>
        <th>Laps</th>
        <th>Status</th>
        <th>Time</th>
        <th>Fastest Lap</th>
        <tr *ngFor="let result of race.Results">
          <td>{{ result.position }}</td>
          <td>
            {{ result.Driver.familyName + ', ' + result.Driver.givenName }}
          </td>
          <td>{{ result.Driver.nationality }}</td>
          <td>{{ result.number }}</td>
          <td>{{ result.Constructor.name }}</td>
          <td>{{ result.points }}</td>
          <td>{{ result.laps }}</td>
          <td>{{ result.status }}</td>
          <td>{{ result.Time?.time || '' }}</td>
          <td>{{ result.FastestLap?.Time?.time || '' }}</td>
        </tr>
      </table>
    </div>
  `,
  styles: [],
})
export class ResultsComponent {
  private _seasonsStore = inject(SeasonsStore);
  public results$ = this._seasonsStore.selectedResults$;
  public totalFinished$ = this._seasonsStore.totalFinished$;
  public totalAccident$ = this._seasonsStore.totalAccident$;
  public totalPlus1$ = this._seasonsStore.totalPlus1$;
}
