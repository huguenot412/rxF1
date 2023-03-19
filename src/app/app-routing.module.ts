import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { SeasonsComponent } from './components/seasons/seasons.component';
import { RouteParams } from './enums/route-params';

const routes: Routes = [
  { path: '', component: SeasonsComponent },
  { path: 'seasons', component: SeasonsComponent },
  {
    path: `seasons/:${RouteParams.Year}`,
    component: SeasonsComponent,
  },
  {
    path: `seasons/:year/:${RouteParams.DataSet}`,
    component: SeasonsComponent,
  },
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
