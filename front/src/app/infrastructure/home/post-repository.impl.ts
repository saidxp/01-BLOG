import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, map, catchError, throwError } from 'rxjs';
import { PostRepository } from '../../domain/home/repository/post.repository';
import { Post } from '../../domain/home/entity/post.entity';
import { PostDto } from './dto/post.dto';
import { toPostEntity } from './mappers/post.mapper';
import { environment } from '../../../environments/environment.development'; 

@Injectable()
export class PostRepositoryImpl extends PostRepository {
  private readonly http = inject(HttpClient);
  
  private readonly baseUrl = `${environment.apiUrl}/api/posts`; // <<==>> \\ 

   override getFeed(): Observable<Post[]> {
    const params = new HttpParams()
      .set('page', 0)
      .set('size', 10);

    return this.http.get<PostDto[]>(this.baseUrl, { params }).pipe(
      map((dtos) => dtos.map(toPostEntity)),
      catchError((err: HttpErrorResponse) => {
        return throwError(() => new Error('Failed to load feed.'));
      })
    );
  }
}