import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SeasonsStore } from 'src/app/stores/seasons-store';
import { LetModule } from '@ngrx/component';
import { SeasonsService } from 'src/app/services/seasons.service';
import { RequestConfig } from 'src/app/models/get-seasons-config';

@Component({
  selector: 'f1-pagination',
  standalone: true,
  imports: [CommonModule, LetModule],
  template: `
    <ng-container *ngrxLet="requestConfig$ as config">
      <label for="resultsPerPage"
        >Results per page:
        <select
          #results
          type="select"
          name="resultsPerPage"
          id="resultsPerPage"
          (change)="changeResultsPerPage(+results.value, config)"
        >
          <option value="10">10</option>
          <option value="15">15</option>
          <option value="25">25</option>
        </select>
      </label>
      <ul class="pages-list">
        <li
          class="page"
          [ngClass]="{ highlighted: page === (currentPage$ | async) }"
          *ngFor="let page of pages$ | async"
          (click)="updateCurrentPage(page, config)"
        >
          {{ page }}
        </li>
      </ul>
    </ng-container>
  `,
  styles: [
    `
      .pages-list {
        list-decoration: none;
        display: flex;
        flex-wrap: wrap;
        gap: 0.2rem;
        margin: 1rem 0;
        padding: 0;
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
  private _seasonsService = inject(SeasonsService);
  public pages$ = this._seasonsStore.pages$;
  public currentPage$ = this._seasonsStore.currentPage$;
  public requestConfig$ = this._seasonsStore.requestConfig$;
  public resultsPerPage$ = this._seasonsStore.resultsPerPage$;
  public dataSet$ = this._seasonsService.dataSet$;

  public updateCurrentPage(currentPage: number, config: RequestConfig) {
    this._seasonsStore.patchState({ currentPage });
    this._getData(config);
  }

  public changeResultsPerPage(val: number, config: RequestConfig): void {
    this._seasonsStore.patchState({ resultsPerPage: val, currentPage: 1 });
    this._seasonsStore.getData(config);
  }

  private _getData(config: RequestConfig): void {
    this._seasonsStore.getData(config);
  }
}
