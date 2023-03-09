import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { SeasonsComponent } from './components/seasons/seasons.component';

const routes: Routes = [
  { path: '', component: SeasonsComponent },
  { path: 'seasons', component: SeasonsComponent },
  { path: 'seasons/:year', component: SeasonsComponent },
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
