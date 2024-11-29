import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VoteService {

  private http = inject(HttpClient);
  private baseUrl: string = environment.BACKEND_BASE_URL;
  private totalVotes$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  private votedValue$: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  constructor() {}


  set votedValue(value: number){
    this.votedValue$.next(value);
  }

  get votedValue():Observable<number> {
    return this.votedValue$.asObservable();
  }

  set totalVotes(value:number){
    this.totalVotes$.next(value);
  }

  get totalVotes():Observable<number> {
    return this.totalVotes$.asObservable()
  }

  public hasUserVotedThisThing(user_id: number | undefined, thing_id: number):Observable<number>{  // returns value (1 | -1) if voted, 0 if not
   return this.http.get<number>(`${this.baseUrl}/hasUservotedThisThing?user_id=${user_id}&thing_id=${thing_id}`);
  }

  public updateVotes(thing_id: number, value: number):Observable<any>{ // returns the updated votes thing
    return this.http.post<any>(`${this.baseUrl}/things/updatevotes`, { thing_id: thing_id, votevalue: value });
  }

  public vote(user_id: number | undefined, thing_id: number, value: number):Observable<any>{
    return this.http.post<any>(`${this.baseUrl}/vote`, {user_id, thing_id, value}); // returns 400 if user has voted that thing
  }
}
