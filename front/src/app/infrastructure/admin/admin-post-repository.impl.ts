import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, map, catchError, throwError } from 'rxjs';
import { AdminPostRepository, PagedAdminPosts } from '../../domain/admin/repository/admin-post.repository';
import { AdminPostPageDto } from './dto/admin-post.dto';
import { toAdminPostEntity } from './mapper/admin-post.mapper';
import { environment } from '../../../environments/environment.development';

@Injectable()
export class AdminPostRepositoryImpl extends AdminPostRepository {
  private readonly http = inject(HttpClient);

  override getPosts(page: number): Observable<PagedAdminPosts> {
    const params = new HttpParams().set('page', page).set('size', 20);

    return this.http
      .get<AdminPostPageDto>(`${environment.apiUrl}/api/admin/posts`, { params, withCredentials: true })
      .pipe(
        map((pageDto) => ({
          posts: pageDto.content.map(toAdminPostEntity),
          totalPages: pageDto.totalPages,
          currentPage: pageDto.number,
        })),
        catchError(() => throwError(() => new Error('Failed to load posts.')))
      );
  }

  override deletePost(id: number): Observable<void> {
    // reuses the EXISTING post-delete endpoint, which already supports admin permission
    return this.http
      .delete<void>(`${environment.apiUrl}/api/posts/${id}`, { withCredentials: true })
      .pipe(catchError(() => throwError(() => new Error('Failed to delete post.'))));
  }
  
}