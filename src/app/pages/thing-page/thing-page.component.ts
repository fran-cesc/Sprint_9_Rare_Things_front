import { CommonModule } from '@angular/common';
import { Component, inject, type OnInit } from '@angular/core';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ThingsService } from '../../services/things.service';
import { Thing } from '../../interfaces/things.interface';

@Component({
  selector: 'app-thing-page',
  standalone: true,
  imports: [
    CommonModule,
    NavbarComponent
  ],
  templateUrl: './thing-page.component.html',
  styleUrl: './thing-page.component.css'
})
export class ThingPageComponent implements OnInit {

  public id!: number;
  public currentThing?: Thing;
  public baseUrl: string = 'http://localhost:3000/';

  private route = inject(ActivatedRoute);
  private thingsService = inject(ThingsService);
  private router = inject(Router);

  ngOnInit(): void {
    this.route.params.subscribe( params => {
      this.id = params?.['id'];
      this.thingsService.getThing(this.id).subscribe(
        (thing) => {
          console.log(thing);
          this.currentThing = thing
        },
        (error) => {
          //TODO optimize error
          console.error("Could not retrieve thing:", error);
        }
      )

    });
  }

  public goBack(){
    this.router.navigate(['things']);
  }

  public comment(){
    
  }

}
