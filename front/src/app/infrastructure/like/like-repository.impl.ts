import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { LikeRepository } from '../../domain/like/repository/like.repository';
import { LikeStatus } from '../../domain/like/entity/like-status.entity';
import { LikeStatusDto } from './dto/like-status.dto';
import { environment } from '../../../environments/environment.development';

@Injectable()
export class LikeRepositoryImpl extends LikeRepository {
  private readonly http = inject(HttpClient);
  private url(postId: number): string {
    return `${environment.apiUrl}/api/posts/${postId}/like`;
  }
  // AUTHENTICATED -======>>> BACKE -> 401 <!!> \\ {<!!>} \\ 
  override like(postId: number): Observable<LikeStatus> {
    return this.http.post<LikeStatusDto>(this.url(postId), {}, { withCredentials: true }).pipe(
      map((dto) => new LikeStatus(dto.liked, dto.likeCount))
    );
  }

  override unlike(postId: number): Observable<LikeStatus> {
    return this.http.delete<LikeStatusDto>(this.url(postId), { withCredentials: true }).pipe(
      map((dto) => new LikeStatus(dto.liked, dto.likeCount))
    );
  }
}