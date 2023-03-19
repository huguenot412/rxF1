import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SeasonsStore } from 'src/app/stores/seasons-store';
import { LetModule } from '@ngrx/component';
import { MatTableModule } from '@angular/material/table';
import { CdkColumnDef } from '@angular/cdk/table';

@Component({
  selector: 'f1-standings',
  standalone: true,
  imports: [CommonModule, LetModule, MatTableModule],
  providers: [CdkColumnDef],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng-container
      *ngrxLet="{
        standings: driverStandings$,
        currentPage: currentPage$
      } as vm"
    >
      <h1>Standings Data</h1>
      <div
        class="results"
        *ngFor="let list of vm.standings.get(vm.currentPage)"
      >
        <h3>Round: {{ list.round }}</h3>
        <table mat-table [dataSource]="list.DriverStandings!">
          <ng-container matColumnDef="position">
            <th mat-header-cell *matHeaderCellDef>Position</th>
            <td mat-cell *matCellDef="let element">{{ element.position }}</td>
          </ng-container>
          <ng-container matColumnDef="driver">
            <th mat-header-cell *matHeaderCellDef>Driver</th>
            <td mat-cell *matCellDef="let element">
              {{ element.Driver.familyName + ', ' + element.Driver.givenName }}
            </td>
          </ng-container>
          <ng-container matColumnDef="nationality">
            <th mat-header-cell *matHeaderCellDef>Nationality</th>
            <td mat-cell *matCellDef="let element">
              {{ element.Driver.nationality }}
            </td>
          </ng-container>
          <ng-container matColumnDef="points">
            <th mat-header-cell *matHeaderCellDef>Points</th>
            <td mat-cell *matCellDef="let element">{{ element.points }}</td>
          </ng-container>
          <ng-container matColumnDef="wins">
            <th mat-header-cell *matHeaderCellDef>Wins</th>
            <td mat-cell *matCellDef="let element">{{ element.wins }}</td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
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
export class StandingsComponent {
  private _seasonsStore = inject(SeasonsStore);
  public driverStandings$ = this._seasonsStore.standingsPagesMap$;
  public currentPage$ = this._seasonsStore.currentPage$;
  public displayedColumns: string[] = [
    'position',
    'driver',
    'nationality',
    'points',
    'wins',
  ];
}
