import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { CommentReadRepository, PagedComments } from '../../../domain/comment/repository/comment-read.repository';

@Injectable({ providedIn: 'root' })
export class GetCommentsUseCase { 

  private readonly commentReadRepository = inject(CommentReadRepository);

  execute(postId: number, page: number): Observable<PagedComments> {
    return this.commentReadRepository.getComments(postId, page);
  } 

}