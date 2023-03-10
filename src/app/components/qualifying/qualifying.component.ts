import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'f1-qualifying',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h1>Qualifying Results Data</h1>
    <pre>{{ (qualifyingData | async | json) || 'Loading...' }}</pre>
  `,
  styles: [],
})
export class QualifyingComponent {
  @Input()
  public qualifyingData: any;
}
