import { Observable } from 'rxjs';
import { Comment } from '../entity/comment.entity';

export abstract class CommentRepository {

  abstract addComment(
    postId: number,
    content: string 
  ): Observable<Comment>;

}