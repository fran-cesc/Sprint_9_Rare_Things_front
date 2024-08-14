import { CommonModule } from '@angular/common';
import { Component, inject, WritableSignal, type OnInit } from '@angular/core';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ThingsService } from '../../services/things.service';
import { Thing } from '../../interfaces/things.interface';
import { VoteService } from '../../services/vote.service';
import { UsersService } from '../../services/users.service';
import { User } from '../../interfaces/user';

@Component({
  selector: 'app-thing-page',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  templateUrl: './thing-page.component.html',
  styleUrl: './thing-page.component.css',
})
export class ThingPageComponent implements OnInit {
  public id!: number;
  public currentThing!: Thing;
  public currentUser!: User;
  public baseUrl: string = 'BACKEND_BASE_URL';
  public isLogged?: boolean;
  public hasVoted?: boolean;

  private route = inject(ActivatedRoute);
  private thingsService = inject(ThingsService);
  private router = inject(Router);
  private voteService = inject(VoteService);
  private usersService = inject(UsersService);

  constructor() {}

  ngOnInit(): void {
    this.currentUser = this.usersService.currentUser();
    console.log('thing-page-comp, ngOnInit, currentUser:', this.currentUser);

    this.route.params.subscribe((params) => {
      this.id = params?.['thing_id'];
      this.thingsService.getThing(this.id).subscribe((thing) => {
        this.currentThing = thing;
      });
    });

    this.isLogged = this.usersService.isLogged();
  }

  public goBack() {
    this.router.navigate(['things']);
  }

  public userVote(user_id: number, thing_id: number, value: number) {
    this.voteService
      .hasUserVoted(this.currentUser.user_id, this.currentThing.thing_id)
      .subscribe((resp) => {
        this.hasVoted = resp.hasVoted;

        console.log('userVote hasVoted:', this.hasVoted);

        if (this.hasVoted) {
          alert('you have already voted this Thing');
          return;
        }

        this.voteService.vote(user_id, thing_id).subscribe(
          (resp) => console.log('user voted:', resp),
          (error) => {
            console.error('Error registering vote:', error);
            alert(error);
          }
        );

        this.voteService.updateVotes(thing_id, value).subscribe(() => {
          this.thingsService.getThing(this.id).subscribe((thing) => {
            this.currentThing = thing;
            alert('Thank you for voting!');
          });
        });
      });
  }
  comment(){
    //TODO implement comments
  }
}
