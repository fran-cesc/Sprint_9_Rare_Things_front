import { CommonModule } from '@angular/common';
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
import { CommentComponent } from '../../components/comment/comment.component';
import { CommentService } from '../../services/comment.service';


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

    this.activatedRoute.params.subscribe((params) => {
      this.id = params['thing_id'];
      this.thingsService.getThing(this.id).subscribe((thing) => {
        this.currentThing = thing;
            this.commentService.getCommentsByThing(this.currentThing?.thing_id).subscribe( (comments: Comment[]) => {
              this.currentComments = comments;
            });
      });
    });
  };

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
        this.alertService.showYouMustBeLoggedAlert();
      }, 100);
      return;
    }
    this.voteService
      .hasUserVoted(this.currentUser.user_id, this.currentThing!.thing_id)
      .subscribe((resp) => {
        this.hasVoted = resp;
        if (this.hasVoted) {
          setTimeout(() => {
            this.alertService.showAlert({
              text: 'you have already voted this Thing',
              icon: 'warning',
            });
          }, 100);
          return;
        }

        this.voteService.vote(user_id, thing_id).subscribe({
          next: (resp) => console.log('user voted:', resp),
          error: (error) => console.error('Error registering vote:', error),
        });

        this.voteService.updateVotes(thing_id, value).subscribe( () => {
          this.thingsService.getThing(this.id).subscribe( (thing) => {
            this.currentThing = thing;
            setTimeout(() => {
              this.alertService.showAlert({
                text: 'Thank you for voting!',
                icon: 'success',
              });
            }, 100);
          });
        });
      });
  }

  comment(thing_id: number, user_id: number | undefined) {
    if (!this.currentUser){
      setTimeout(() => {
        this.alertService.showAlert({
          text: 'You must be logged in to comment',
          icon: 'warning',
        });
      }, 100);

      return;
    }

    const modalRef = this.modalService.open(CommentComponent);
    modalRef.componentInstance.thing_id = thing_id;
    modalRef.componentInstance.user_id = user_id;
  }
}
