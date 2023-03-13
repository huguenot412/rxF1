import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaginationConfig } from 'src/app/models/pagination-config';

@Component({
  selector: 'f1-pagination',
  standalone: true,
  imports: [CommonModule],
  template: ` <p>pagination works!</p> `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaginationComponent {
  @Input()
  public config: PaginationConfig = {
    currentPage: 1,
    limit: 10,
    offset: 0,
  };
  @Output()
  public pageChanged = new EventEmitter<number>();
}
