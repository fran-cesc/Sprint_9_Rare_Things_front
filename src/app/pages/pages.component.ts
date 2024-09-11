import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../shared/navbar/navbar.component';

@Component({
  selector: 'app-pages',
  standalone: true,
  imports: [ RouterModule, NavbarComponent ],
  templateUrl: './pages.component.html',
  styleUrl: './pages.component.css'
})
export default class PagesComponent {

}
