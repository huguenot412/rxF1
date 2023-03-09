import { Component } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'f1-page-not-found',
  standalone: true,
  imports: [CommonModule, RouterModule, NgOptimizedImage],
  template: `
    <h1>Page Not Found</h1>
    <p>We're sorry. The page you are looking for is in another castle!</p>
    <img
      ngSrc="./assets/images/another-castle.jpg"
      alt="Your page is in another castle"
      height="300"
      width="400"
      priority
    />
    <a [routerLink]="['/seasons']">Back to home</a>
  `,
  styles: [
    `
      :host {
        display: flex;
        flex-direction: column;
        align-items: center;
      }
    `,
  ],
})
export class PageNotFoundComponent {}
