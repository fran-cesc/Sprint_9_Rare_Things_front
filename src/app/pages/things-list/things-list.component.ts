import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TitleCasePipe, UpperCasePipe } from '@angular/common';
import { environment } from '../../../environments/environment';
import { Thing } from '../../interfaces/things.interface';
import { ThingsService } from '../../services/things.service';
import { NavbarComponent } from '../../shared/navbar/navbar.component';

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

  private thingsService = inject(ThingsService)

  constructor(){}

  ngOnInit(): void{
    this.thingsService.getAllThings()
      .subscribe({
        next: (things) => {
          this.things = things;
        },
        error: (error) => {
          console.log("Could not retrieve things list. Error: ", error);
        }
      });
  }
}
