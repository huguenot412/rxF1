import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SeasonsStore } from 'src/app/stores/seasons-store';
import { LetModule } from '@ngrx/component';

@Component({
  selector: 'f1-pagination',
  standalone: true,
  imports: [CommonModule, LetModule],
  template: `
    <h2>Pagination!</h2>
    <ul class="pages-list" *ngrxLet="limit$ as limit">
      <li
        class="page"
        [ngClass]="{ highlighted: page === (currentPage$ | async) }"
        *ngFor="let page of pages$ | async"
        (click)="updateCurrentPage(page, limit)"
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
  public pages$ = this._seasonsStore.pages$;
  public currentPage$ = this._seasonsStore.currentPage$;
  public getDataConfig$ = this._seasonsStore.getDataConfig$;
  public limit$ = this._seasonsStore.limit$;

  public updateCurrentPage(currentPage: number, limit: number) {
    this._seasonsStore.patchState({ currentPage });
    this._getData(limit);
  }

  private _getData(limit: number): void {
    console.log(limit);
    if (limit < 1) return;
    this._seasonsStore.getSeasonData(this.getDataConfig$);
  }
}

// Check if data for view has already been fetched
// if data.length < page * limit
// Calculate number of missing results
// Set the offset and limit
// Fetch missing results
// Patch missing results
