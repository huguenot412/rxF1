import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'f1-standings',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h1>Standings Data</h1>
    <pre>{{ (standingsData | async | json) || 'Loading...' }}</pre>
  `,
  styles: [],
})
export class StandingsComponent {
  @Input()
  public standingsData: any;
}
