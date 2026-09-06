import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, map, catchError, throwError } from 'rxjs';
import { PostWriteRepository } from '../../domain/post/repositories/post-write.repository';
import { environment } from '../../../environments/environment.development';

interface CreatePostResponseDto {
  id: number;
}

@Injectable()
export class PostWriteRepositoryImpl extends PostWriteRepository { 

  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/api/posts`; // <<==>> \\ (!)
  override createPost(title: string, content: string, media: File | null): Observable<number> {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    if (media) {
      formData.append('media', media);
    }
    return this.http.post<CreatePostResponseDto>(this.baseUrl, formData, { withCredentials: true }).pipe(
      map((response) => response.id),
      catchError((err: HttpErrorResponse) => {
        const backendMessage = err.error?.message; 
        console.log('Error At Atuhenticated', err);
        return throwError(() => new Error(backendMessage ?? 'Failed To Create Post.'));
      })
    ); 
  }
}