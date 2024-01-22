import { Routes } from '@angular/router';
import { ThingsListComponent } from './pages/things-list/things-list.component';
import { HomeComponent } from './pages/home/home.component';
import { MapComponent } from './pages/map/map.component';
import { AddThingComponent } from './components/addThing/addThing.component';

export const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'things',
    component: ThingsListComponent
    // children: [
    //   {
    //     path: 'new',
    //     title: 'Add new thing',
    //     component: AddThingComponent
    //   },
    //   {
    //     path: 'edit/:id',
    //     component: AddRunnerComponent
    //   },
    //   {
    //     path: ':id',
    //     component: AddRunnerComponent
    //   }
    // ],
  },
  {
    path: 'map',
    component: MapComponent
  },
  // {
  //   path: 'things/new',
  //   component: AddThingComponent
  // },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  }
];
