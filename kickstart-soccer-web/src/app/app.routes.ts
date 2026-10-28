import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'coach/drills/:drillId',
    loadComponent: () => import('./coach/drill-detail.page').then((m) => m.DrillDetailPage),
  },
  {
    path: 'coach/seasons/new',
    loadComponent: () => import('./coach/create-season.page').then((m) => m.CreateSeasonPage),
  },
  {
    path: 'coach/seasons/:seasonId',
    loadComponent: () => import('./coach/season-overview.page').then((m) => m.SeasonOverviewPage),
  },
  {
    path: 'coach/practices/:practiceId',
    loadComponent: () => import('./coach/practice-detail.page').then((m) => m.PracticeDetailPage),
  },
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.routes').then((m) => m.routes),
  },
];
