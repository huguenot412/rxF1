import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SeasonsStore } from 'src/app/stores/seasons-store';
import { LetModule } from '@ngrx/component';

@Component({
  selector: 'f1-drivers',
  standalone: true,
  imports: [CommonModule, LetModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng-container
      *ngrxLet="{
        driversPageMap: driversPagesMap$,
        currentPage: currentPage$
      } as vm"
    >
      <table>
        <th>Last Name</th>
        <th>First Name</th>
        <th>Nationality</th>
        <tr *ngFor="let driver of vm.driversPageMap.get(vm.currentPage)">
          <td>{{ driver.familyName }}</td>
          <td>{{ driver.givenName }}</td>
          <td>{{ driver.nationality }}</td>
        </tr>
      </table>
      <ng-container> </ng-container
    ></ng-container>
  `,
  styles: [],
})
export class DriversComponent {
  private _seasonsStore = inject(SeasonsStore);
  public offset$ = this._seasonsStore.offset$;
  public selectedDrivers$ = this._seasonsStore.selectedDrivers$;
  public driversPagesMap$ = this._seasonsStore.driversPagesMap$;
  public currentPage$ = this._seasonsStore.currentPage$;
}
