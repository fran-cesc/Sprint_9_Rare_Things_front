import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { User } from '../../interfaces/user.interface';
import { UsersService } from '../../services/users.service';
import { of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { ThingsService } from '../../services/things.service';
import { Thing } from '../../interfaces/things.interface';
import { Comment } from '../../interfaces/comments.interface';
import { environment } from '../../../environments/environment';
import { DatePipe, TitleCasePipe, UpperCasePipe } from '@angular/common';
import { CommentService } from '../../services/comment.service';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [ RouterLink, UpperCasePipe, TitleCasePipe, DatePipe],
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
      switchMap(user => {
        if (user && user.user_id !== undefined) {
          this.currentUser = user;
          return this.thingsService.getAllThingsFromUser(user.user_id)
            .pipe(
              catchError(error => {
                if (error.status === 404) {
                  console.log('No things found for this user');
                  return of(null);
                }
                console.error('Error fetching things:', error);
                return of(null);
              })
            );
        } else {
          return of(null);
        }
      }),
      switchMap( things => {
        if (things){
          this.currentThingList = things;
        }
        return (this.currentUser && this.currentUser.user_id !== undefined) ? this.commentService.getCommentsByUser(this.currentUser.user_id) : of(null)

      })
    ).subscribe((comments) => {
      if (comments){

        return this.currentCommentList = comments;

      } else {
        console.log('There are no comments for this user yet');
        return of(null);
      }
    });
  }
}
