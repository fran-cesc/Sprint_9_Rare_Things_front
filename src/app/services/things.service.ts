import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';
import { Thing } from '../interfaces/things.interface';

@Injectable({
  providedIn: 'root',
})
export class ThingsService {
  public baseUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  getThing(id: number): Observable<Thing>{
    return this.http.get<Thing>(`${this.baseUrl}/things/${id}`)
  }

  getAllThings(): Observable<Thing[]> {
    return this.http.get<Thing[]>(`${this.baseUrl}/things`);
  }

  delThing(id: number): Observable<boolean> {
    return this.http.delete(`${this.baseUrl}/things/${id}`).pipe(
      catchError((err) => of(false)),
      map((resp) => true)
    );
  }

  addThing(fdThing: FormData): Observable<FormData> {
    return this.http.post<FormData>(`${this.baseUrl}/things`, fdThing);
  }
}
