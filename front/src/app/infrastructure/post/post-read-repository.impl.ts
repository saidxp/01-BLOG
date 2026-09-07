import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, map, catchError, throwError } from 'rxjs';
import { PostReadRepository } from '../../domain/post/repositories/post-read.repository';
import { PostDetail } from '../../domain/post/entity/PostDetail';
import { PostDetailDto } from './dto/post-detail.dto';
import { toPostDetailEntity } from './mapper/post-detail.mapper';
import { environment } from '../../../environments/environment.development';

@Injectable()
export class PostReadRepositoryImpl extends PostReadRepository {
  private readonly http = inject(HttpClient);
 
  private readonly baseUrl = `${environment.apiUrl}/api/posts`;

  override getPostById(id: number): Observable<PostDetail> {
    return this.http.get<PostDetailDto>(`${this.baseUrl}/${id}`).pipe(
      map(toPostDetailEntity),
      catchError((err: HttpErrorResponse) => {
        if (err.status === 404) {
          return throwError(() => new Error('Post not found.'));
        }
        return throwError(() => new Error('Failed to load post.'));
      })
    );
  }
  
}