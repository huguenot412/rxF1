import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SeasonsStore } from 'src/app/stores/seasons-store';
import { LetModule } from '@ngrx/component';
import { MatTableModule } from '@angular/material/table';
import { CdkColumnDef } from '@angular/cdk/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'f1-drivers',
  standalone: true,
  imports: [CommonModule, LetModule, MatTableModule, MatProgressSpinnerModule],
  providers: [CdkColumnDef],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng-container
      *ngrxLet="{
        driversPageMap: driversPagesMap$,
        currentPage: currentPage$
      } as vm"
    >
      <table mat-table [dataSource]="vm.driversPageMap.get(vm.currentPage)!">
        <ng-container matColumnDef="lastName">
          <th mat-header-cell *matHeaderCellDef>Last Name</th>
          <td mat-cell *matCellDef="let element">{{ element.familyName }}</td>
        </ng-container>
        <ng-container matColumnDef="firstName">
          <th mat-header-cell *matHeaderCellDef>First Name</th>
          <td mat-cell *matCellDef="let element">{{ element.givenName }}</td>
        </ng-container>
        <ng-container matColumnDef="nationality">
          <th mat-header-cell *matHeaderCellDef>Nationality</th>
          <td mat-cell *matCellDef="let element">{{ element.nationality }}</td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
      </table>
      <div class="loading-spinner-wrapper" *ngIf="loadingData$ | async">
        <mat-spinner color="accent"/>
      </div>
  `,
  styles: [
    `
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
export class DriversComponent {
  private _seasonsStore = inject(SeasonsStore);
  public offset$ = this._seasonsStore.offset$;
  public selectedDrivers$ = this._seasonsStore.selectedDrivers$;
  public driversPagesMap$ = this._seasonsStore.driversPagesMap$;
  public currentPage$ = this._seasonsStore.currentPage$;
  public loadingData$ = this._seasonsStore.loadingData$;
  public displayedColumns: string[] = ['lastName', 'firstName', 'nationality'];
}
