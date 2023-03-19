import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SeasonsStore } from 'src/app/stores/seasons-store';
import { LetModule } from '@ngrx/component';

@Component({
  selector: 'f1-standings',
  standalone: true,
  imports: [CommonModule, LetModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng-container
      *ngrxLet="{
        standings: driverStandings$,
        currentPage: currentPage$
      } as vm"
    >
      <h1>Standings Data</h1>
      <div *ngFor="let list of vm.standings.get(vm.currentPage)">
        <h3>Round: {{ list.round }}</h3>
        <table>
          <th>Position</th>
          <th>Driver</th>
          <th>Nationality</th>
          <th>Points</th>
          <th>Wins</th>

          <tr *ngFor="let standing of list.DriverStandings">
            <td>{{ standing.position }}</td>
            <td>
              {{
                standing.Driver.familyName + ', ' + standing.Driver.givenName
              }}
            </td>
            <td>{{ standing.Driver.nationality }}</td>
            <td>{{ standing.points }}</td>
            <td>{{ standing.wins }}</td>
          </tr>
        </table>
      </div>
    </ng-container>
  `,
  styles: [],
})
export class StandingsComponent {
  private _seasonsStore = inject(SeasonsStore);
  public driverStandings$ = this._seasonsStore.standingsPagesMap$;
  public currentPage$ = this._seasonsStore.currentPage$;
}
