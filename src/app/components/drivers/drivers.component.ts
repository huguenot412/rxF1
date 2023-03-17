import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { SeasonsStore } from 'src/app/stores/seasons-store';

@Component({
  selector: 'f1-drivers',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h1>Drivers</h1>
    <table>
      <th>Last Name</th>
      <th>First Name</th>
      <th>Nationality</th>
      <tr *ngFor="let driver of selectedDrivers$ | async">
        <td>{{ driver.familyName }}</td>
        <td>{{ driver.givenName }}</td>
        <td>{{ driver.nationality }}</td>
      </tr>
    </table>
  `,
  styles: [],
})
export class DriversComponent {
  private _seasonsStore = inject(SeasonsStore);
  public offset$ = this._seasonsStore.offset$;
  public selectedDrivers$ = this._seasonsStore.selectedDrivers$;
}
