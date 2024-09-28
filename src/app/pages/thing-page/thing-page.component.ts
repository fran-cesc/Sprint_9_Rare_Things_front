import { CommonModule } from '@angular/common';
import { Component, inject, WritableSignal, type OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { Thing } from '../../interfaces/things.interface';
import { User } from '../../interfaces/user';
import { ThingsService } from '../../services/things.service';
import { UsersService } from '../../services/users.service';
import { VoteService } from '../../services/vote.service';
import { NavbarComponent } from '../../shared/navbar/navbar.component';

@Component({
  selector: 'app-thing-page',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  templateUrl: './thing-page.component.html',
  styleUrl: './thing-page.component.css',
})
export default class ThingPageComponent implements OnInit {
  public id!: number;
  public currentThing?: Thing;
  public currentUser?: User | null;
  public baseUrl: string = environment.BACKEND_BASE_URL;
  public hasVoted?: boolean;

  private activatedRoute = inject(ActivatedRoute);
  private thingsService = inject(ThingsService);
  private router = inject(Router);
  private voteService = inject(VoteService);
  private userService = inject(UsersService);

  constructor() {
    this.userService.user$.subscribe((user) => {
      this.currentUser = user;
    });
    this.activatedRoute.params.subscribe((params) => {
      this.id = params['thing_id'];
      this.thingsService.getThing(this.id).subscribe((thing) => {
        this.currentThing = thing;
      });
    });
  }

  ngOnInit(): void {}

  public goBack() {
    this.router.navigate(['/pages/things-list']);
  }

  public userVote(user_id: number, thing_id: number, value: number) {
    this.voteService
      .hasUserVoted(this.currentUser!.user_id, this.currentThing!.thing_id)
      .subscribe((resp) => {
        this.hasVoted = resp.hasVoted;

        console.log('userVote hasVoted:', this.hasVoted);

        if (this.hasVoted) {
          alert('you have already voted this Thing');
          return;
        }

        this.voteService.vote(user_id, thing_id).subscribe({
          next: (resp) => console.log('user voted:', resp),
          error: (error) => console.error('Error registering vote:', error),
        });

        this.voteService.updateVotes(thing_id, value).subscribe(() => {
          this.thingsService.getThing(this.id).subscribe((thing) => {
            this.currentThing = thing;
            alert('Thank you for voting!');
          });
        });
      });
  }
  comment() {
    alert('Comments are not implemented yet, sorry!');
  }
}
