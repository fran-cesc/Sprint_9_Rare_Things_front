import { Routes } from '@angular/router';
import { ThingsListComponent } from './pages/things-list/things-list.component';
import { HomeComponent } from './pages/home/home.component';
import { MapComponent } from './pages/map/map.component';
import { ThingPageComponent } from './pages/thing-page/thing-page.component';

export const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'things',
    component: ThingsListComponent,
    // children: [
    //   {
    //     path: ':id',
    //     component: ThingPageComponent
    //   }
    // ],
  },
  {
    path: 'map',
    component: MapComponent
  },
  {
    path: 'thing-page',
    component: ThingPageComponent,
    // children: [
    //   {
    //     path:':id',
    //     component: ThingPageComponent
    //   }
    // ]
  },
  {
    path: 'thing-page/:id',
    component: ThingPageComponent
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  }
];
