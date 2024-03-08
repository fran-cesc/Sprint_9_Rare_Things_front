import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VoteService {

  private http = inject(HttpClient);
  private baseUrl: string = 'http://localhost:3000';

  constructor() { }

  public hasUserVoted(user_id: number, thing_id: number):Observable<boolean>{
   return this.http.get<boolean>(`${this.baseUrl}/hasvoted?user_id=${user_id}&image_id=${thing_id}`);
  }

  public vote(thing_id: number, value: number):Observable<any>{
    return this.http.post<any>(`${this.baseUrl}/things/updatevotes`, { thing_id: thing_id, votevalue: value });
  }
}
