import { Injectable, inject } from '@angular/core';
import { CommentRepository } from '../../../domain/comment/repository/comment.repository';

@Injectable({
  providedIn: 'root',
})
export class AddCommentUseCase {

  private readonly commentRepository = inject(CommentRepository);

  execute(postId: number, content: string) {
    return this.commentRepository.addComment(postId, content);
  } 

}