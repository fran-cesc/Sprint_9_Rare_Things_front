import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Comment } from '../interfaces/comments.interface';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  private http = inject(HttpClient);
  public baseUrl = environment.BACKEND_BASE_URL;

  constructor() { }

  addComment( thing_id: number, user_id: number, comment: string): Observable<any>{
    const body = {
      thing_id,
      user_id,
      comment
    };

    return this.http.post(`${this.baseUrl}/comments`, body);
  }

  getCommentsByThing( thing_id: number):Observable<Comment[]>{
    return this.http.get<Comment[]>(`${this.baseUrl}/comments/${thing_id}`);
  }


  getCommentsByUser( user_id: number):Observable<Comment[]>{
    return this.http.get<Comment[]>(`${this.baseUrl}/comments/user/${user_id}`);
  }
}
