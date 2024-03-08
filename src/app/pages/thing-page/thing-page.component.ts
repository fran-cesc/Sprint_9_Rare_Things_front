import { CommonModule } from '@angular/common';
import { Component, inject, type OnInit } from '@angular/core';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ThingsService } from '../../services/things.service';
import { Thing } from '../../interfaces/things.interface';
import { VoteService } from '../../services/vote.service';
import { UsersService } from '../../services/users.service';

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
  public isLogged?: boolean;
  public hasVoted?: boolean;

  private route = inject(ActivatedRoute);
  private thingsService = inject(ThingsService);
  private router = inject(Router);
  private voteService = inject(VoteService);
  private usersService = inject(UsersService);

  ngOnInit(): void {
    this.route.params.subscribe( params => {
      this.id = params?.['thing_id'];
      this.thingsService.getThing(this.id).subscribe(
        (thing: Thing) => {
          this.currentThing = thing
          // this.voteService.hasUserVoted(this.usersService.getCurrentUser(). , this.currentThing.thing_id).subscribe(
          //   (resp) => { this.hasVoted = resp});
        }
      )
    });
    this.isLogged = this.usersService.isLogged();
  }

  public goBack(){
    this.router.navigate(['things']);
  }

  public vote(image_id:number, value: number){

    this.voteService.hasUserVoted(this.currentThing!.user_id, this.currentThing!.thing_id).subscribe(
      (resp) => {
        this.hasVoted = resp;
      }
    );
    if (this.hasVoted) {
      alert("you have already voted this Thing");
      return;
    }

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
