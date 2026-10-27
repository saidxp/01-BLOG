import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { PostWriteRepository } from '../../domain/post/repositories/post-write.repository';
import { environment } from '../../../environments/environment.development';

interface CreatePostResponseDto {
  id: number;
}

@Injectable()
export class PostWriteRepositoryImpl extends PostWriteRepository {

  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/api/posts`;
  private readonly uploadurl =   `${environment.apiUrl}/api/media/upload`;
  // <<==>> \\ (!) 

  override createPost(title: string, content: string, media: File | null): Observable<number> { 
    
    const formData = new FormData(); 
    formData.append('title', title);
    formData.append('content', content);
    if (media) {
      formData.append('media', media);
    }

    return this.http.post<CreatePostResponseDto>(this.baseUrl, formData, { withCredentials: true }).pipe(
      map((response) => response.id)
    );
    
  }

  override uploadInlineImage(file: File): Observable<string> {
    const formData = new FormData();
    formData.append('file', file);
    // <<==>> \\ 
    return this.http
      .post<{ url: string }>(this.uploadurl, formData, { withCredentials: true })
      .pipe(map((response) => response.url));
  }
 
}