import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'f1-results',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h1>Race Results Data</h1>
    <pre>{{ (dataSet | async | json) || 'Loading...' }}</pre>
  `,
  styles: [],
})
export class ResultsComponent {
  @Input()
  public dataSet: any;
}
