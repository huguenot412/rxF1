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
    <h1>Drivers Data</h1>
    <pre>{{ selectedDrivers$ | async | json }}</pre>
  `,
  styles: [],
})
export class DriversComponent {
  private _seasonsStore = inject(SeasonsStore);
  public offset$ = this._seasonsStore.offset$;
  public selectedDrivers$ = this._seasonsStore.selectedDrivers$;
}
