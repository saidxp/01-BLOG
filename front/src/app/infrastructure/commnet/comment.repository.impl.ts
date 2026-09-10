import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable , map} from 'rxjs';

import { CommentRepository } from '../../domain/comment/repository/comment.repository';
import { environment } from '../../../environments/environment.development';
import { CommentDto } from './dto/comment.dto';
import { toCommentEntity } from './mapper/comment.mapper';
import { Comment } from '../../domain/comment/entity/comment.entity';
@Injectable()
export class CommentRepositoryImpl extends CommentRepository {

  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/api/posts`;

  override addComment(postId: number, content: string): Observable<Comment> {
    const params = new HttpParams().set('content', content);
    return this.http
      .post<CommentDto>(`${this.baseUrl}/${postId}/comments`, null, { params, withCredentials: true })
      .pipe(map(toCommentEntity));
  }
}