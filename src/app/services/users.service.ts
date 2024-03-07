import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../interfaces/user';
import { Observable, firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private httpClient = inject(HttpClient);
  private baseUrl: string = 'http://localhost:3000';


  constructor() {
    type Response<User> = User | User[];
  }

  public register(user: User){
    console.log("servei 3 (register)");
    console.log(user);

    return firstValueFrom(
      this.httpClient.post<User>(`${this.baseUrl}/register`, user)
    );
  }

  public login(user: User) {
    return firstValueFrom(
      this.httpClient.post<User>(`${this.baseUrl}/login`, user)
    );
  }

  async isMailRegistered(email: string) {
    // return false;
    try {
      const user: User[] = await firstValueFrom(
      this.httpClient.get<User[]>(`${this.baseUrl}/users/${email}`));

      console.log("entrem a isMailRegistered");
      console.log(user);
      const userArray: any[] = [];

      if (Array.isArray(user) === false){
        userArray.push(user);
      };
      console.log("userArray:");
      console.log(userArray);
      console.log(userArray[0]);
      // const isRegistered = (userArray.length > 0) ? true : false;
      const isRegistered = userArray.length > 0;

      console.log("isRegistered?");
      console.log(isRegistered);

      return isRegistered;

    } catch (error) {
      console.log(error);
      throw new Error('Error verifying email:' + error);
    }
  }

  isLogged(): boolean {
    return localStorage.getItem('token') ? true : false;
  }
}
