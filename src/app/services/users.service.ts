import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User, UserLoginForm } from '../interfaces/user';
import { BehaviorSubject, catchError, empty, firstValueFrom, map, Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private http = inject(HttpClient);
  private baseUrl: string = environment.BACKEND_BASE_URL;
  private currentUser: User | null;
  private _user$: BehaviorSubject<User | null>;

  constructor() {
    this.currentUser = {
      user_id: 0,
      user_name: '',
      email: '',
      password: '',
      accessToken: ''
    }
    this._user$ = new BehaviorSubject<User | null>(this.currentUser);
  }


  set user(user: User | null){
      this.currentUser = user;
      this._user$.next(this.currentUser);
      console.log('service currentUser: ',this.currentUser);
  }

  get user$(){
   return this._user$.asObservable()
  }

  // public register(user: User){
  //   return firstValueFrom(
  //     this.http.post<User>(`${this.baseUrl}/register`, user)
  //   );
  // }

  public register(form: any): Observable<any>{
    return this.http.post<User>(`${this.baseUrl}/register`, form)
  }

  // public login(userLoginForm: UserLoginForm) {
  //   return firstValueFrom(
  //     this.http.post<any>(`${this.baseUrl}/login`, userLoginForm)
  //   );
  // }

  public login(email: string, password: string): Observable<any>{
    const body = { email, password };
    return this.http.post<any>(`${this.baseUrl}/login`, body)
  }

  // async isMailRegistered(email: string) {
  //   try {
  //     const user: User[] = await firstValueFrom(
  //     this.http.get<User[]>(`${this.baseUrl}/users/${email}`));

  //     // get user returns either an empty array or an object with the user. Always an array:
  //     let userArray: any[] = [];
  //     if (Array.isArray(user) === false){
  //       userArray.push(user);
  //     };
  //     const isRegistered = userArray.length > 0;
  //     return isRegistered;
  //   } catch (error) {
  //     console.log(error);
  //     throw new Error('Error verifying email:' + error);
  //   }
  // }

public getUserByEmail(email: string): Observable<any>{
  return this.http.get<User>(`${this.baseUrl}/users/${email}`)
}

  // public isMailRegistered(email: string): Observable<boolean>{
  //   this.http.get<User>(`${this.baseUrl}/users/${email}`).subscribe( (resp) =>{
  //     next: (resp: User) => {
  //       if ( resp !== null && resp !== undefined) {
  //         return true
  //       } else return false
  //     }
  //     error: (error: Error) => {
  //       console.error('error getting user')
  //     }
  //   })
  // }

  // public isMailRegistered(email: string): Observable<boolean> {
  //   return this.http.get<User>(`${this.baseUrl}/users/${email}`).pipe(
  //     map((user: User) => {
  //       console.log('user:',user)
  //       return !!user;
  //     }),
  //     catchError((error: Error) => {
  //       console.error('Error verifying mail:', error);
  //       return of(false);
  //     })
  //   );
  // }



  isUserLogged(): boolean {
    return localStorage.getItem('token') ? true : false;
  }

}
