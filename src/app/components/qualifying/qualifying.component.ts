import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { SeasonsStore } from 'src/app/stores/seasons-store';

@Component({
  selector: 'f1-qualifying',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h1>Qualifying Results Data</h1>
    <pre>{{ qualifyingResults$ | async | json }}</pre>
  `,
  styles: [],
})
export class QualifyingComponent {
  private _seasonsStore = inject(SeasonsStore);
  public qualifyingResults$ = this._seasonsStore.selectedQualifyingResults$;
}
