import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SeasonsStore } from 'src/app/stores/seasons-store';
import { LetModule } from '@ngrx/component';
import { MatTableModule } from '@angular/material/table';
import { CdkColumnDef } from '@angular/cdk/table';

@Component({
  selector: 'f1-qualifying',
  standalone: true,
  imports: [CommonModule, LetModule, MatTableModule],
  providers: [CdkColumnDef],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng-container
      *ngrxLet="{
        qualifyingMap: qualifyingResults$,
        currentPage: currentPage$
      } as vm"
    >
      <div
        class="results"
        *ngFor="let race of vm.qualifyingMap.get(vm.currentPage)"
      >
        <h3>Round: {{ race.round }}</h3>
        <table mat-table [dataSource]="race.QualifyingResults!">
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
          <ng-container matColumnDef="constructor">
            <th mat-header-cell *matHeaderCellDef>Constructor</th>
            <td mat-cell *matCellDef="let element">
              {{ element.Constructor.name }}
            </td>
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
export class QualifyingComponent {
  private _seasonsStore = inject(SeasonsStore);
  public qualifyingResults$ = this._seasonsStore.qualifyingPagesMap$;
  public currentPage$ = this._seasonsStore.currentPage$;
  public displayedColumns: string[] = [
    'position',
    'driver',
    'nationality',
    'constructor',
  ];
}
