import { Injectable, inject } from '@angular/core'; 
import { Observable } from 'rxjs';
import { CommentRepository } from '../../../domain/comment/repository/comment.repository';
import { Comment } from '../../../domain/comment/entity/comment.entity';

// <<==>> \\ (<!!>) // (<!!>) (!!) <<!>> 

@Injectable({
  providedIn: 'root',
})

export class AddCommentUseCase {

  private readonly commentRepository = inject(CommentRepository);

  execute(postId: number, content: string) : Observable<Comment>  {
    return this.commentRepository.addComment(postId, content);
  } 

}