import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { User } from '../../interfaces/user.interface';
import { UsersService } from '../../services/users.service';
import { of, switchMap } from 'rxjs';
import { ThingsService } from '../../services/things.service';
import { Thing } from '../../interfaces/things.interface';
import { Comment } from '../../interfaces/comments.interface';
import { environment } from '../../../environments/environment';
import { TitleCasePipe, UpperCasePipe } from '@angular/common';
import { CommentService } from '../../services/comment.service';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [ RouterLink, UpperCasePipe, TitleCasePipe],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css',
})
export default class UserComponent {
  public currentUser?: User;
  public currentThingList: Thing[] = [];
  public currentCommentList: Comment[] = [];
  public baseUrl: string = environment.BACKEND_BASE_URL;

  private activatedRoute = inject(ActivatedRoute);
  private userService = inject(UsersService);
  private thingsService = inject(ThingsService);
  private commentService = inject(CommentService);

  constructor() {}

  ngOnInit(): void {
    this.activatedRoute.params.pipe(
      switchMap( params => {
        const id = params['user_id'];
        return id ? this.userService.getUserById(id) : of(null);
      }),
      switchMap( user => {
        if (user && user.user_id !== undefined){
          this.currentUser = user;
          console.log('currentUser: ', this.currentUser);
          return this.thingsService.getAllThingsFromUser(user.user_id);
        } else {
          console.log('No user found');
          return of(null);
        }
      }),
      switchMap( things => {
        if (things){
          console.log('things: ', things);
          this.currentThingList = things;
          return (this.currentUser && this.currentUser.user_id !== undefined) ? this.commentService.getCommentsByUser(this.currentUser.user_id) : of(null)
        } else {
          console.log('no things found for this user');
          return of(null);
        }

      })
    ).subscribe((comments) => {
      if (comments){
        console.log('comments: ', comments);
        return this.currentCommentList = comments;

      } else {
        console.log('There are no comments for this user yet');
        return of(null);
      }
    });
  }
}
