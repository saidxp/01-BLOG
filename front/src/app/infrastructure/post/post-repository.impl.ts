import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, map, catchError, throwError, tap} from 'rxjs';
import { PostRepository } from '../../domain/post/repositories/post.repository';
import { toPostEntity } from './mapper/post.mapper';
import { environment } from '../../../environments/environment.development'; 
import {PagedPosts} from '../../domain/post/repositories/post.repository'
import { PostPageDto } from './dto/post.dto';

@Injectable()
export class PostRepositoryImpl extends PostRepository {

  private readonly http = inject(HttpClient);

  private readonly baseUrl = `${environment.apiUrl}/api/posts`;
  override getFeed(page : number): Observable<PagedPosts> {

    const params = new HttpParams().set('page', page).set('size', 10);

    return this.http.get<PostPageDto>(this.baseUrl, { params }).pipe(
     map((pageDto) => ({
        posts: pageDto.content.map(toPostEntity),
        totalPages: pageDto.totalPages,
        currentPage: pageDto.number,
      })),
      tap((post)=> console.log('posts shape', post)),
      catchError((err: HttpErrorResponse) => {
        return throwError(() => new Error('Failed to load feed.'));
      })
    );
    // <<==>> \\ (<!!>)
  }

  override getPostsByUsername(username: string, page: number): Observable<PagedPosts> { 
    // <<==>> \\ (<!<->!>) \\ (<<!<->!>>) \\ (<!!>)
    console.log("Hello World Im Her If You Want", username , page)
  const params = new HttpParams().set('page', page).set('size', 10);
  return this.http  
    .get<PostPageDto>(`${environment.apiUrl}/api/users/${username}/posts`, { params, withCredentials: true })
    .pipe(
      map((pageDto) => ({
        posts: pageDto.content.map(toPostEntity),
        totalPages: pageDto.totalPages,
        currentPage: pageDto.number,
      })),
      catchError((err: HttpErrorResponse) =>{
         console.error('REAL ERROR:', err);  
        return throwError(() => new Error('Failed to load posts.'));
      })
    );
  }
  // <<==>> \\ (<!!>) \\ // <<==>> \\  
}