import { inject } from '@angular/core';
import { Router, Routes } from '@angular/router';
import { requireRole } from './services/app-role.guards';

export const routes: Routes = [
  {
    path: 'onboarding',
    loadComponent: () => import('./tab1/tab1.page').then((m) => m.Tab1Page),
  },
  {
    path: 'home',
    pathMatch: 'full',
    redirectTo: '/onboarding',
  },
  {
    path: 'tabs/tab1',
    redirectTo: '/onboarding',
    pathMatch: 'full',
  },
  {
    path: 'tabs/tab2',
    redirectTo: '/plan',
    pathMatch: 'full',
  },
  {
    path: 'tabs/tab3',
    redirectTo: '/dashboard',
    pathMatch: 'full',
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/onboarding',
  },
  {
    path: '',
    canActivateChild: [requireRole],
    loadChildren: () => import('./tabs/tabs.routes').then((m) => m.routes),
  },
  {
    path: '**',
    redirectTo: '/onboarding',
  },
];
