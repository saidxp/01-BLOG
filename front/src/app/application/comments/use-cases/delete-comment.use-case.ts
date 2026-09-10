import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { CommentReadRepository } from '../../../domain/comment/repository/comment-read.repository';

@Injectable({ providedIn: 'root' })
export class DeleteCommentUseCase {

  private readonly commentReadRepository = inject(CommentReadRepository);
  // <<==>> \\ (<!!>) \\ \\ 
  execute(postId: number, commentId: number): Observable<void> {
    return this.commentReadRepository.deleteComment(postId, commentId);
  }
}