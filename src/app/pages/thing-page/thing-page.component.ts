import { CommonModule, DatePipe, TitleCasePipe } from '@angular/common';
import { Component, inject, type OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { Thing } from '../../interfaces/things.interface';
import { User } from '../../interfaces/user.interface';
import { Comment } from '../../interfaces/comments.interface';
import { ThingsService } from '../../services/things.service';
import { UsersService } from '../../services/users.service';
import { VoteService } from '../../services/vote.service';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { AlertService } from '../../services/alert.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommentComponent } from '../../components/comment/addComment.component';
import { CommentService } from '../../services/comment.service';
import { tap, switchMap } from 'rxjs';


@Component({
  selector: 'app-thing-page',
  standalone: true,
  imports: [CommonModule, NavbarComponent, DatePipe, TitleCasePipe],
  templateUrl: './thing-page.component.html',
  styleUrl: './thing-page.component.css',
})
export default class ThingPageComponent implements OnInit {
  public currentId!: number;
  public currentThing?: Thing;
  public currentUser?: User;
  public baseUrl: string = environment.BACKEND_BASE_URL;
  public hasVoted: boolean = false;
  public currentComments: Comment[] = [];

  private activatedRoute = inject(ActivatedRoute);
  private thingsService = inject(ThingsService);
  private router = inject(Router);
  private voteService = inject(VoteService);
  private userService = inject(UsersService);
  private alertService = inject(AlertService);
  private modalService = inject(NgbModal);
  private commentService = inject(CommentService);

  constructor() {
  }

  ngOnInit(): void {
    this.userService.user$.subscribe( (user) => {
      this.currentUser = user;
    });

  this.activatedRoute.params
  .pipe(
    tap((params) => {
      this.currentId = +params['thing_id'];  // Keep currentId updated
    }),
    switchMap((params) => this.thingsService.getThing(+params['thing_id'])),
    tap((thing) => {
      this.currentThing = thing;  // Update the current thing
    }),
    switchMap((thing) => this.commentService.getCommentsByThing(thing.thing_id))  // Fetch comments for the current thing
  )
  .subscribe((comments: Comment[]) => {
    this.currentComments = comments;  // Update comments
  });
}
  public goBack() {
    this.router.navigate(['/pages/things-list']);
  }

  public userVote(
    user_id: number | undefined,
    thing_id: number,
    value: number
  ) {
    if (this.currentUser === undefined) {
      setTimeout(() => {
        this.alertService.showYouMustBeLoggedAlert({text: 'You must be logged in to vote', icon: 'warning'});
      }, 100);
      return;
    }

    this.voteService
    .hasUserVoted(this.currentUser.user_id, this.currentThing!.thing_id)
    .pipe(
      tap((hasVoted) => {
        this.hasVoted = hasVoted;

        if (this.hasVoted) {
          setTimeout(() => {
            this.alertService.showAlert({
              text: 'You have already voted for this Thing',
              icon: 'warning',
            });
          }, 100);
          throw new Error('User has already voted');
        }
      }),
      switchMap(() => this.voteService.vote(user_id, thing_id)),    // First, register the vote
      switchMap(() => this.voteService.updateVotes(thing_id, value)), // Then, update the vote count
      switchMap(() => this.thingsService.getThing(this.currentId)),   // Fetch updated thing data
      tap((updatedThing) => {
        this.currentThing = updatedThing;
        setTimeout(() => {
          this.alertService.showAlert({
            text: 'Thank you for voting!',
            icon: 'success',
          });
        }, 100);
      })
    )
    .subscribe({
      error: (error) => {
        if (error.message !== 'User has already voted') {
          console.error('Error registering vote:', error);
        }
      }
    });

    // this.voteService
    //   .hasUserVoted(this.currentUser.user_id, this.currentThing!.thing_id)
    //   .subscribe((resp) => {
    //     this.hasVoted = resp;
    //     if (this.hasVoted) {
    //       setTimeout(() => {
    //         this.alertService.showAlert({
    //           text: 'you have already voted this Thing',
    //           icon: 'warning',
    //         });
    //       }, 100);
    //       return;
    //     }

    //     this.voteService.vote(user_id, thing_id).subscribe({
    //       next: (resp) => console.log('user voted:', resp),
    //       error: (error) => console.error('Error registering vote:', error),
    //     });

    //     this.voteService.updateVotes(thing_id, value).subscribe( () => {
    //       this.thingsService.getThing(this.currentId).subscribe( (thing) => {
    //         this.currentThing = thing;
    //         setTimeout(() => {
    //           this.alertService.showAlert({
    //             text: 'Thank you for voting!',
    //             icon: 'success',
    //           });
    //         }, 100);
    //       });
    //     });
    //   });
    }

  comment(thing_id: number, user_id: number | undefined) {
    if (!this.currentUser){
      setTimeout(() => {
        this.alertService.showYouMustBeLoggedAlert({text: 'You must be logged in to comment', icon: 'warning'});
      }, 100);
      return;
    }

    const modalRef = this.modalService.open(CommentComponent);
    modalRef.componentInstance.thing_id = thing_id;
    modalRef.componentInstance.user_id = user_id;
  }
}
