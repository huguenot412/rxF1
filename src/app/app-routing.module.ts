import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DriversComponent } from './components/drivers/drivers.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { QualifyingComponent } from './components/qualifying/qualifying.component';
import { ResultsComponent } from './components/results/results.component';
import { SeasonsComponent } from './components/seasons/seasons.component';
import { StandingsComponent } from './components/standings/standings.component';

const routes: Routes = [
  { path: '', component: SeasonsComponent },
  { path: 'seasons', component: SeasonsComponent },
  {
    path: 'seasons/:year',
    component: SeasonsComponent,
    children: [
      { path: 'drivers', component: DriversComponent },
      { path: 'results', component: ResultsComponent },
      { path: 'qualifying', component: QualifyingComponent },
      { path: 'standings', component: StandingsComponent },
    ],
  },
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
