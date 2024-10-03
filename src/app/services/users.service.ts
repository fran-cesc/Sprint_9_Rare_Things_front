import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../interfaces/user';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { AlertService } from './alert.service';

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

  public register(form: any): Observable<any> {
    return this.http.post<User>(`${this.baseUrl}/register`, form);
  }

  public login(email: string, password: string): Observable<any> {
    const body = { email, password };
    return this.http.post<any>(`${this.baseUrl}/login`, body).pipe(
      tap((response) => {
        if (response.token) {
          this._isUserLogged$.next(true);
        }
      })
    );
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

  public getUserByEmail(email: string): Observable<any> {
    return this.http.get<User>(`${this.baseUrl}/users/${email}`);
  }

  isUserLogged(): Observable<boolean> {
    return this._isUserLogged$.asObservable();
  }
}
