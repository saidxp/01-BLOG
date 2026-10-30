import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
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
      }))
    );
    // <<==>> \\ (<!!>)
  } 

  // get subsc feed {}
  override getSubscriptionfeed(page: number): Observable<PagedPosts> { 

    const params = new HttpParams().set('page', page).set('size', 10); 

    const base = `${environment.apiUrl}/api/feed/following`;

    return this.http.get<PostPageDto>(base, { params, withCredentials: true }).pipe(
     map((pageDto) => ({
        posts: pageDto.content.map(toPostEntity),
        totalPages: pageDto.totalPages,
        currentPage: pageDto.number,
      }))
    );
  }

  override getPostsByUsername(username: string, page: number): Observable<PagedPosts> { 
    // <<==>> \\ (<!<->!>) \\ (<<!<->!>>) \\ (<!!>)
  const params = new HttpParams().set('page', page).set('size', 10);
  return this.http  
    .get<PostPageDto>(`${environment.apiUrl}/api/users/${username}/posts`, { params, withCredentials: true })
    .pipe(
      map((pageDto) => ({
        posts: pageDto.content.map(toPostEntity),
        totalPages: pageDto.totalPages,
        currentPage: pageDto.number,
      }))
    );
  } 

  // <<==>> \\ (<!!>) \\ // <<==>> \\   
  override deletePost(id: number): Observable<void> {
    // reuses the EXISTING post-delete endpoint, which already supports admin permission
    return this.http.delete<void>(`${environment.apiUrl}/api/posts/${id}`, { withCredentials: true });
  }
  
}