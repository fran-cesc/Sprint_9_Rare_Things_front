import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User, UserLoginForm } from '../interfaces/user';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private baseUrl: string = environment.BACKEND_BASE_URL;
  private currentUser: User | null;

  private _isUserLogged$: BehaviorSubject<boolean>;
  private _user$: BehaviorSubject<User | null>;

  private http = inject(HttpClient);
  private router = inject(Router);

  constructor() {
    this.currentUser = {
      user_id: 0,
      user_name: '',
      email: '',
      password: '',
      accessToken: '',
    };
    this._user$ = new BehaviorSubject<User | null>(this.currentUser);
    this._isUserLogged$ = new BehaviorSubject<boolean>(false);
  }

  set user(user: User | null) {
    this.currentUser = user;
    this._user$.next(this.currentUser);
    console.log('service currentUser: ', this.currentUser);
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
      tap( response => {
        if (response.token) {
          this._isUserLogged$.next(true);
        }
      })

    )
  }

  public logout(){
    localStorage.removeItem('token');
    this._isUserLogged$.next(false);
    this.currentUser = null;
    this._user$.next(this.currentUser);
    this.router.navigate(['pages/home']);
    alert('You have been logged out');
  }

  public getUserByEmail(email: string): Observable<any> {
    return this.http.get<User>(`${this.baseUrl}/users/${email}`);
  }

  isUserLogged(): Observable<boolean>{
    return this._isUserLogged$.asObservable();
  }
}
