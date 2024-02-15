import { Component } from '@angular/core';
import { NavbarComponent } from "../../shared/navbar/navbar.component";
import { Thing } from '../../interfaces/things.interface';
import { ThingsService } from '../../services/things.service';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-things-list',
    standalone: true,
    templateUrl: './things-list.component.html',
    styleUrl: './things-list.component.css',
    imports: [NavbarComponent, RouterLink]
})
export class ThingsListComponent{

  public things: Thing[] = [];
  public baseUrl: string = 'http://localhost:3000/';

  constructor( private thingsService: ThingsService){}

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
