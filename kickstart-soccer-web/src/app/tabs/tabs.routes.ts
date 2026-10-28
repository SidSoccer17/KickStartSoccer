import { Routes } from '@angular/router';
import { TabsPage } from './tabs.page';
import { requireCoach } from '../services/app-role.guards';

export const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('../home/home.page').then((m) => m.HomePage),
      },
      {
        path: 'plan',
        canActivate: [requireCoach],
        loadComponent: () =>
          import('../tab2/tab2.page').then((m) => m.Tab2Page),
      },
      {
        path: 'library',
        loadComponent: () =>
          import('../tab3/tab3.page').then((m) => m.Tab3Page),
      },
      {
        path: 'players',
        canActivate: [requireCoach],
        loadComponent: () =>
          import('../players/players.page').then((m) => m.PlayersPage),
      },
      {
        path: 'more',
        loadComponent: () =>
          import('../more/more.page').then((m) => m.MorePage),
      },
      {
        path: 'seasons',
        pathMatch: 'full',
        canActivate: [requireCoach],
        loadComponent: () =>
          import('../coach/season-list.page').then((m) => m.SeasonListPage),
      },
      {
        path: 'coach/seasons/new',
        canActivate: [requireCoach],
        loadComponent: () =>
          import('../coach/create-season.page').then((m) => m.CreateSeasonPage),
      },
      {
        path: 'coach/seasons/:seasonId',
        canActivate: [requireCoach],
        loadComponent: () =>
          import('../coach/season-overview.page').then((m) => m.SeasonOverviewPage),
      },
      {
        path: 'coach/practices/:practiceId',
        canActivate: [requireCoach],
        loadComponent: () =>
          import('../coach/practice-detail.page').then((m) => m.PracticeDetailPage),
      },
      {
        path: 'coach/drills/:drillId',
        canActivate: [requireCoach],
        loadComponent: () =>
          import('../coach/drill-detail.page').then((m) => m.DrillDetailPage),
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: '/dashboard',
      },
    ],
  },
];
