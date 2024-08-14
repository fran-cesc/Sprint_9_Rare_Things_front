import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VoteService {

  private http = inject(HttpClient);
  private baseUrl: string = 'https://rare-things-back.onrender.com';

  constructor() { }

  public hasUserVoted(user_id: number, thing_id: number):Observable<any>{
   return this.http.get<boolean>(`${this.baseUrl}/hasvoted?user_id=${user_id}&thing_id=${thing_id}`);
  }

  public updateVotes(thing_id: number, value: number):Observable<any>{
    return this.http.post<any>(`${this.baseUrl}/things/updatevotes`, { thing_id: thing_id, votevalue: value });
  }

  public vote(user_id: number, thing_id: number):Observable<any>{
    return this.http.post<any>(`${this.baseUrl}/vote`, {user_id, thing_id});
  }
}
