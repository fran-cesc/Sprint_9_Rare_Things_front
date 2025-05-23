import { Routes } from '@angular/router';
import { NopagefoundComponent } from './pages/nopagefound/nopagefound.component';
import PagesComponent from './pages/pages.component';
import { userLoggedGuard } from './guards/user.guard';
import { ForbiddenPageComponent } from './pages/forbidden-page/forbidden-page.component';

export const routes: Routes = [

  {
    path:'forbidden',
    title: 'Forbidden Page',
    component: ForbiddenPageComponent
  },
  {
    path: 'pages',
    component: PagesComponent,
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      },
      {
        path: 'home',
        title: 'Home',
        loadComponent: () => import('./pages/home/home.component'),
      },
      {
        path: 'things-list',
        title: 'Things List',
        loadComponent: () => import('./pages/things-list/things-list.component'),
      },
      {
        path: 'thing-page/:thing_id',
        title: 'Thing',
        loadComponent: () => import('./pages/thing-page/thing-page.component'),
      },
      {
        path: 'user/:user_id',
        title: 'User',
        loadComponent: () => import('./pages/user/user.component'),
        canActivate: [ userLoggedGuard ]
      }
    ]
  },
  {
    path:'',
    redirectTo: 'pages/home',
    pathMatch: 'full'
  },
  {
    path:'**',
    title: 'Not Found',
    component: NopagefoundComponent
  }
];
