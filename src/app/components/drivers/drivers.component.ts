import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';

@Component({
  selector: 'f1-drivers',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h1>Drivers Data</h1>
    <pre>{{ (driversData | json) || 'Loading...' }}</pre>
  `,
  styles: [],
})
export class DriversComponent {
  @Input()
  public driversData: any;
}
