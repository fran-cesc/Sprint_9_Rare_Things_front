import { Component, inject } from '@angular/core';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { User } from '../../interfaces/user.interface';
import { UsersService } from '../../services/users.service';
import { of, startWith, switchMap } from 'rxjs';
import { ThingsService } from '../../services/things.service';
import { Thing } from '../../interfaces/things.interface';
import { environment } from '../../../environments/environment';
import { TitleCasePipe, UpperCasePipe } from '@angular/common';

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
  public baseUrl: string = environment.BACKEND_BASE_URL;

  private activatedRoute = inject(ActivatedRoute);
  private userService = inject(UsersService);
  private thingsService = inject(ThingsService);

  constructor() {}

  ngOnInit(): void {
    this.activatedRoute.params.pipe(
      switchMap( params => {
        const id = params['user_id'];
        return id ? this.userService.getUserById(id) : of(null);
      }),
      switchMap( user => {
        this.currentUser = user;
        console.log('currentUser: ', this.currentUser);
        return this.thingsService.getAllThingsFromUser(user.user_id);
      })
    ).subscribe((things) => {
      console.log('things: ', things);
      return things ? this.currentThingList = things : console.log('no things found for this user');
    });
  }
}
