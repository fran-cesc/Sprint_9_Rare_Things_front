import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';
import { Thing } from '../interfaces/thing';

@Injectable({
  providedIn: 'root'
})
export class ThingsService {

  public baseUrl = 'http://localhost:3000';

  constructor( private http: HttpClient ) { }

  getAllThings(): Observable<Thing[]>{
    return this.http.get<Thing[]>(`${this.baseUrl}/things`);
  }

  delThing(id: number): Observable<boolean>{
      return this.http.delete(`${this.baseUrl}/things/${id}`)
      .pipe(
        catchError(err => of(false)),
        map( resp => true)
      );
  }


  addThing(fdThing: FormData): Observable<FormData>{
    return this.http.post<FormData>(`${this.baseUrl}/things`, fdThing)
  }

  // updateRunner(runner: Runner, id:number): Observable<Runner>{
  //   return this.http.patch<Runner>(`${this.baseUrl}/runners/${id}`, runner)
  // }

}
