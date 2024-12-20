import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, empty, firstValueFrom, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { AlertService } from './alert.service';
import { LoginResponse, User, UserLoginForm } from '../interfaces/user.interface';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private baseUrl: string = environment.BACKEND_BASE_URL;
  private currentUser: User | undefined;

  private _isUserLogged$: BehaviorSubject<boolean>;
  private _user$: BehaviorSubject<User | undefined>;

  private http = inject(HttpClient);
  private router = inject(Router);
  private alertService = inject(AlertService);

  constructor() {
    this.currentUser = undefined;
    this._user$ = new BehaviorSubject<User | undefined>(this.currentUser);
    this._isUserLogged$ = new BehaviorSubject<boolean>(false);
  }

  set user(user: User | undefined) {
    this.currentUser = user;
    this._user$.next(this.currentUser);
  }

  get user$() {
    return this._user$.asObservable();
  }

  public login(email: string, password: string) {
    return firstValueFrom(
      this.http.post<LoginResponse>(`${this.baseUrl}/login`, {email, password})
    );
  }

  public register(form: any) {
    return firstValueFrom(
      this.http.post<any>(`${this.baseUrl}/register`, form)
    );
  }


  async isMailRegistered(email: string) {
    try {
      const user: User[] = await firstValueFrom(
      this.http.get<User[]>(`${this.baseUrl}/users/email/${email}`));
      // get user returns either an empty array or an object with the user. Always an array:
      let userArray: any[] = [];
      if (Array.isArray(user) === false){
        userArray.push(user);
      };
      const isRegistered = userArray.length > 0;
      return isRegistered;

    } catch (error: any) {
      return false;
    }
  }

  // isLogged(): boolean {
  //   return localStorage.getItem('token') ? true : false;
  // }

  getUserById(id: number): Observable<User>{
    return this.http.get<User>(`${this.baseUrl}/users/id/${id}`);
  }

  isUserLogged(): Observable<boolean> {
    return this._isUserLogged$.asObservable();
  }

  set isUserLogged$(value: boolean){
    this._isUserLogged$.next(value);
  }

  public logout() {
    localStorage.removeItem('token');
    this._isUserLogged$.next(false);
    this.currentUser = undefined;
    this._user$.next(this.currentUser);
    setTimeout(() => {
      this.alertService.showAlert({
        text: 'You have been logged out',
        icon: 'success',
      });
    }, 100);
    this.router.navigate(['pages/home']);
  }
}
