import { CommonModule, DatePipe, Location, TitleCasePipe } from '@angular/common';
import { Component, inject, type OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { Thing } from '../../interfaces/things.interface';
import { User } from '../../interfaces/user.interface';
import { Comment } from '../../interfaces/comments.interface';
import { ThingsService } from '../../services/things.service';
import { UsersService } from '../../services/users.service';
import { VoteService } from '../../services/vote.service';
import { AlertService } from '../../services/alert.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommentComponent } from '../../components/comment/addComment.component';
import { CommentService } from '../../services/comment.service';
import { tap, switchMap } from 'rxjs';
@Component({
  selector: 'app-thing-page',
  standalone: true,
  imports: [CommonModule, DatePipe, TitleCasePipe],
  templateUrl: './thing-page.component.html',
  styleUrl: './thing-page.component.css',
})
export default class ThingPageComponent implements OnInit {
  public currentId!: number;
  public currentThing?: Thing;
  public currentUser?: User;
  public baseUrl: string = environment.BACKEND_BASE_URL;
  public currentComments: Comment[] = [];
  public initialVotedValue: number = 0;
  public currentVotedValue: number = 0;
  public initialTotalVotes: number = 0;
  public currentTotalVotes: number = 0;

  private activatedRoute = inject(ActivatedRoute);
  private thingsService = inject(ThingsService);
  private voteService = inject(VoteService);
  private userService = inject(UsersService);
  private alertService = inject(AlertService);
  private modalService = inject(NgbModal);
  private commentService = inject(CommentService);
  private location = inject(Location);

  constructor() {}

  ngOnInit(): void {
    this.userService.user$.subscribe((user) => {
      this.currentUser = user;
    });

    this.activatedRoute.params
      .pipe(
        tap((params) => {
          this.currentId = +params['thing_id']; // Keep currentId updated
        }),
        switchMap((params) => this.thingsService.getThing(+params['thing_id'])),
        tap((thing) => {
          this.currentThing = thing; // Update the current thing
          this.initialTotalVotes = thing.votes;
          this.currentTotalVotes = thing.votes;
        }),
        switchMap((thing) =>
          this.commentService.getCommentsByThing(thing.thing_id)
        ),
        tap((comments: Comment[]) => {
          this.currentComments = comments; // Update comments
        }),
        switchMap(() =>
          this.voteService.hasUserVotedThisThing(
            this.currentUser?.user_id,
            this.currentThing!.thing_id
          )
        )
      )
      .subscribe((votedValue) => {
        this.initialVotedValue = votedValue;
        this.currentVotedValue = votedValue;
      });
  }

  public goBack() {
    this.location.back();
  }

  public userVote(
    user_id: number | undefined,
    thing_id: number,
    value: number
  ) {
    if (this.currentUser === undefined) {
      setTimeout(() => {
        this.alertService.showYouMustBeLoggedAlert({
          text: 'You must be logged in to vote',
          icon: 'warning',
        });
      }, 100);
      return;
    }

    // Prevent user from voting the same way again
    if (this.currentVotedValue === value) {
      setTimeout(() => {
        this.alertService.showAlert({
          text: 'You have already voted this way',
          icon: 'warning',
        });
      }, 100);
      return;
    }

    this.voteService
      .vote(user_id, thing_id, value)
      .pipe(
        switchMap(() => this.thingsService.getThing(thing_id)), // update thing from backend
        tap((updatedThing) => {
          this.currentThing = updatedThing;
          this.currentTotalVotes = updatedThing.votes;
          this.initialTotalVotes = updatedThing.votes;
          this.currentVotedValue = value;
          this.initialVotedValue = value;
          console.log("currentVotedValue=", this.currentVotedValue);
          console.log("initialVotedValue=", this.initialVotedValue);
          console.log("initialTotalVotes=", this.initialTotalVotes);
          console.log("currentTotalVotes=", this.currentTotalVotes);
        })
      )
      .subscribe({
        next: () => console.log('Vote registered and thing updated'),
        error: (err) => {
          console.error('Error voting:', err);
          this.alertService.showAlert({
            text: err.error?.error || 'There was an error voting',
            icon: 'error',
          });
        },
      });
  }



  comment(thing_id: number, user_id: number | undefined) {
    if (!this.currentUser) {
      setTimeout(() => {
        this.alertService.showYouMustBeLoggedAlert({
          text: 'You must be logged in to comment',
          icon: 'warning',
        });
      }, 100);
      return;
    }
    const modalRef = this.modalService.open(CommentComponent);
    modalRef.componentInstance.thing_id = thing_id;
    modalRef.componentInstance.user_id = user_id;
    modalRef.closed.pipe(
      switchMap( (thing_id)=> this.commentService.getCommentsByThing(thing_id)),
      tap((comments: Comment[]) => {
        this.currentComments = comments;
      })
    ).subscribe()
  }

}
