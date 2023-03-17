import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SeasonsStore } from 'src/app/stores/seasons-store';

@Component({
  selector: 'f1-results',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h1>Race Results Data</h1>
    <pre>{{ results$ | async | json }}</pre>
  `,
  styles: [],
})
export class ResultsComponent {
  private _seasonsStore = inject(SeasonsStore);
  public results$ = this._seasonsStore.selectedResults$;
}
