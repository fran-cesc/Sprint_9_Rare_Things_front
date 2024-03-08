import { CommonModule } from '@angular/common';
import { Component, inject, type OnInit } from '@angular/core';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ThingsService } from '../../services/things.service';
import { Thing } from '../../interfaces/things.interface';
import { VoteService } from '../../services/vote.service';

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
  private voteService = inject(VoteService);

  ngOnInit(): void {
    this.route.params.subscribe( params => {
      this.id = params?.['thing_id'];
      this.thingsService.getThing(this.id).subscribe(
        (thing: Thing) => {
          console.log(thing);
          this.currentThing = thing
        }
      )
    });
  }

  public goBack(){
    this.router.navigate(['things']);
  }

  public vote(image_id:number, value: number){

    // const hasUserVoted = this.voteService.hasUserVoted(this.currentThing?.user_name, this.currentThing?.id)

    console.log("vote button clicked", value);
    this.voteService.vote(image_id, value).subscribe(
      (resp) => {
        this.thingsService.getThing(this.id).subscribe(
          (thing: Thing) => {
            this.currentThing = thing
          }
        )
      }
    );
  }

  public comment(){
    //TODO implement comment function
  }

}
