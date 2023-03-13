import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DriversComponent } from './components/drivers/drivers.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { QualifyingComponent } from './components/qualifying/qualifying.component';
import { ResultsComponent } from './components/results/results.component';
import { SeasonsComponent } from './components/seasons/seasons.component';
import { StandingsComponent } from './components/standings/standings.component';
import { RouteParams } from './enums/route-params';
import { seasonsResolver } from './resolvers/seasons-resolver';

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
