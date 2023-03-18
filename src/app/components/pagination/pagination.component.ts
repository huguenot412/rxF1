import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SeasonsStore } from 'src/app/stores/seasons-store';
import { LetModule } from '@ngrx/component';
import { SeasonsService } from 'src/app/services/seasons.service';
import { RequestConfig } from 'src/app/models/request-config';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'f1-pagination',
  standalone: true,
  imports: [CommonModule, LetModule, MatSelectModule],
  template: `
    <ng-container *ngrxLet="requestConfig$ as config">
      <mat-form-field appearance="fill">
        <mat-label>Results per page</mat-label>
        <mat-select
          #results
          (selectionChange)="changeResultsPerPage(+results.value, config)"
        >
          <mat-option value="10">
            {{ 10 }}
          </mat-option>
          <mat-option value="15">
            {{ 15 }}
          </mat-option>
          <mat-option value="25">
            {{ 25 }}
          </mat-option>
        </mat-select>
      </mat-form-field>
      <h3>Pages:</h3>
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
        border-radius: 3px;

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
