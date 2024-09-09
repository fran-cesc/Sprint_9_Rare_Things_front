import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TitleCasePipe, UpperCasePipe } from '@angular/common';
import { NavbarComponent } from '../../../shared/navbar/navbar.component';
import { environment } from '../../../../environments/environment';
import { ThingsService } from '../../../services/things.service';
import { Thing } from '../../../interfaces/things.interface';

@Component({
    selector: 'app-things-list',
    standalone: true,
    templateUrl: './things-list.component.html',
    styleUrl: './things-list.component.css',
    imports: [NavbarComponent, RouterLink, UpperCasePipe, TitleCasePipe]
})
export default class ThingsListComponent{

  public things: Thing[] = [];
  public baseUrl: string = environment.BACKEND_BASE_URL;

  constructor( private thingsService: ThingsService){}

  //TODO lazy loading
  ngOnInit(): void{
    this.thingsService.getAllThings()
      .subscribe(
        (things) => {
          this.things = things
        },
        (error) => {
          //TODO optimize error
          console.log("Could not retrieve things list");
        }
      )
  }
}
