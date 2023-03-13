import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaginationConfig } from 'src/app/models/pagination-config';
import { SeasonsStore } from 'src/app/stores/seasons-store';

@Component({
  selector: 'f1-pagination',
  standalone: true,
  imports: [CommonModule],
  template: `
    <ul class="pages-list">
      <li
        class="page"
        [ngClass]="{ highlighted: page === (currentPage$ | async) }"
        *ngFor="let page of pages$ | async"
        (click)="updateCurrentPage(page)"
      >
        {{ page }}
      </li>
    </ul>
  `,
  styles: [
    `
      .pages-list {
        list-decoration: none;
        display: flex;
        flex-wrap: wrap;
        gap: 0.2rem;
      }

      .page {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 2rem;
        width: 2rem;
        border: 1px solid #333;

        &:hover {
          cursor: pointer;
        }
      }

      .highlighted {
        background-color: #42b883;
        color: #fff;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaginationComponent {
  private _seasonsStore = inject(SeasonsStore);
  @Output()
  public pageChanged = new EventEmitter<number>();
  public pages$ = this._seasonsStore.pages$;
  public currentPage$ = this._seasonsStore.currentPage$;

  public updateCurrentPage(page: number) {
    this._seasonsStore.patchState({ page });
  }
}
