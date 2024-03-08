import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';
import { Thing } from '../interfaces/things.interface';

@Injectable({
  providedIn: 'root',
})
export class ThingsService {

  private http = inject(HttpClient);
  public baseUrl = 'http://localhost:3000';

  constructor() {}

  getThing(thing_id: number): Observable<Thing>{
    return this.http.get<Thing>(`${this.baseUrl}/things/${thing_id}`)
  }

  getAllThings(): Observable<Thing[]> {
    return this.http.get<Thing[]>(`${this.baseUrl}/things`);
  }

  delThing(thing_id: number): Observable<boolean> {
    return this.http.delete(`${this.baseUrl}/things/${thing_id}`).pipe(
      catchError((err) => of(false)),
      map((resp) => true)
    );
  }

  addThing(fdThing: FormData): Observable<FormData> {
    return this.http.post<FormData>(`${this.baseUrl}/things`, fdThing);
  }
}
