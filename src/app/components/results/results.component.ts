import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SeasonsStore } from 'src/app/stores/seasons-store';
import { LetModule } from '@ngrx/component';
import { MatTableModule } from '@angular/material/table';
import { CdkColumnDef } from '@angular/cdk/table';
import { MatChipsModule } from '@angular/material/chips';
import { FormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'f1-results',
  standalone: true,
  imports: [
    CommonModule,
    LetModule,
    MatTableModule,
    MatChipsModule,
    FormsModule,
    MatProgressSpinnerModule,
  ],
  providers: [CdkColumnDef],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng-container
      *ngrxLet="{
        resultsMap: resultsMap$,
        currentPage: currentPage$
      } as vm"
    >
      <h3>Totals (from currently displayed results):</h3>
      <mat-chip-listbox [(ngModel)]="stats">
        <mat-chip-option [selected]="true"
          >Finished: {{ totalFinished$ | async }}</mat-chip-option
        >
        <mat-chip-option
          >Accidents: {{ totalAccident$ | async }}</mat-chip-option
        >
        <mat-chip-option>+1 Lap: {{ totalPlus1$ | async }}</mat-chip-option>
      </mat-chip-listbox>
      <div
        class="results"
        *ngFor="let race of vm.resultsMap.get(vm.currentPage)"
      >
        <h3>Round: {{ race.round }}</h3>
        <table mat-table [dataSource]="race.Results!">
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
          <ng-container matColumnDef="number">
            <th mat-header-cell *matHeaderCellDef>Number</th>
            <td mat-cell *matCellDef="let element">{{ element.number }}</td>
          </ng-container>
          <ng-container matColumnDef="constructor">
            <th mat-header-cell *matHeaderCellDef>Constructor</th>
            <td mat-cell *matCellDef="let element">
              {{ element.Constructor?.name }}
            </td>
          </ng-container>
          <ng-container matColumnDef="points">
            <th mat-header-cell *matHeaderCellDef>Points</th>
            <td mat-cell *matCellDef="let element">{{ element.points }}</td>
          </ng-container>
          <ng-container matColumnDef="laps">
            <th mat-header-cell *matHeaderCellDef>Laps</th>
            <td mat-cell *matCellDef="let element">{{ element.laps }}</td>
          </ng-container>
          <ng-container matColumnDef="status">
            <th mat-header-cell *matHeaderCellDef>Status</th>
            <td
              [ngClass]="{ highlighted: highlightSelectedStat(element.status) }"
              mat-cell
              *matCellDef="let element"
            >
              {{ element.status }}
            </td>
          </ng-container>
          <ng-container matColumnDef="time">
            <th mat-header-cell *matHeaderCellDef>Time</th>
            <td mat-cell *matCellDef="let element">{{ element.Time?.time }}</td>
          </ng-container>
          <ng-container matColumnDef="fastestLap">
            <th mat-header-cell *matHeaderCellDef>Fastest Lap</th>
            <td mat-cell *matCellDef="let element">
              {{ element.FastestLap?.Time?.time }}
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
        </table>
      </div>
    </ng-container>
    <div class="loading-spinner-wrapper" *ngIf="loadingData$ | async">
      <mat-spinner color="accent"/>
    </div>
  `,
  styles: [
    `
      .stats {
        display: flex;
        gap: 1rem;
      }

      .results {
        margin-bottom: 2rem;
      }

      .highlighted {
        background-color: #42b883;
        color: #fff;
      }

      .loading-spinner-wrapper {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        padding: 2rem;
      }
    `,
  ],
})
export class ResultsComponent {
  private _seasonsStore = inject(SeasonsStore);
  public results$ = this._seasonsStore.selectedResults$;
  public resultsMap$ = this._seasonsStore.resultsPagesMap$;
  public currentPage$ = this._seasonsStore.currentPage$;
  public totalFinished$ = this._seasonsStore.totalFinished$;
  public totalAccident$ = this._seasonsStore.totalAccident$;
  public totalPlus1$ = this._seasonsStore.totalPlus1$;
  public loadingData$ = this._seasonsStore.loadingData$;
  public stats: string = '';
  public displayedColumns: string[] = [
    'position',
    'driver',
    'nationality',
    'number',
    'constructor',
    'points',
    'laps',
    'status',
    'time',
    'fastestLap',
  ];

  public highlightSelectedStat(status: string): boolean {
    return this.stats.includes(status);
  }
}
