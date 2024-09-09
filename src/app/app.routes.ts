import { Routes } from '@angular/router';
import { NopagefoundComponent } from './pages/nopagefound/nopagefound.component';

export const routes: Routes = [

  {
    path: 'pages',
    loadComponent: () => import('./pages/pages/pages.component'),
    // component: PagesComponent,
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      },
      {
        path: 'home',
        loadComponent: () => import('./pages/pages/home/home.component'),
        // component: HomeComponent
      },
      {
        path: 'things-list',
        loadComponent: () => import('./pages/pages/things-list/things-list.component'),
        // component: ThingsListComponent,
      },
      {
        path: 'thing-page/:thing_id',
        loadComponent: () => import('./pages/pages/thing-page/thing-page.component'),
        // component: ThingPageComponent
      }
    ]
  },
  {
    path: '',
    redirectTo: 'pages/home',
    pathMatch: 'full'
  },

  {
    path:'**',
    component: NopagefoundComponent
  }
];
