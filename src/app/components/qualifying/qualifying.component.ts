import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { SeasonsStore } from 'src/app/stores/seasons-store';

@Component({
  selector: 'f1-qualifying',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h1>Qualifying Results</h1>
    <table>
      <th>Position</th>
      <th>Driver</th>
      <th>Nationality</th>
      <th>Constructor</th>
      <tr *ngFor="let result of qualifyingResults$ | async">
        <td>{{ result.position }}</td>
        <td>{{ result.Driver.familyName + ', ' + result.Driver.givenName }}</td>
        <td>{{ result.Driver.nationality }}</td>
        <td>{{ result.Constructor.name }}</td>
      </tr>
    </table>
  `,
  styles: [],
})
export class QualifyingComponent {
  private _seasonsStore = inject(SeasonsStore);
  public qualifyingResults$ = this._seasonsStore.selectedQualifyingResults$;
}
