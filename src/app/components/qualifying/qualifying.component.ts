import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { SeasonsStore } from 'src/app/stores/seasons-store';
import { LetModule } from '@ngrx/component';

@Component({
  selector: 'f1-qualifying',
  standalone: true,
  imports: [CommonModule, LetModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng-container
      *ngrxLet="{
        qualifyingMap: qualifyingResults$,
        currentPage: currentPage$
      } as vm"
    >
      <h1>Qualifying Results</h1>
      <div
        class="results"
        *ngFor="let race of vm.qualifyingMap.get(vm.currentPage)"
      >
        <h3>Round: {{ race.round }}</h3>
        <table>
          <th>Position</th>
          <th>Driver</th>
          <th>Nationality</th>
          <th>Constructor</th>
          <tr *ngFor="let result of race.QualifyingResults">
            <td>{{ result.position }}</td>
            <td>
              {{ result.Driver.familyName + ', ' + result.Driver.givenName }}
            </td>
            <td>{{ result.Driver.nationality }}</td>
            <td>{{ result.Constructor.name }}</td>
          </tr>
        </table>
      </div>
    </ng-container>
  `,
  styles: [
    `
      .results {
        margin-bottom: 2rem;
      }
    `,
  ],
})
export class QualifyingComponent {
  private _seasonsStore = inject(SeasonsStore);
  public qualifyingResults$ = this._seasonsStore.qualifyingPagesMap$;
  public currentPage$ = this._seasonsStore.currentPage$;
}
