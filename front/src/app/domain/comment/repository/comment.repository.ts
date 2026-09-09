import { Observable } from 'rxjs';

export abstract class CommentRepository {
    
  abstract addComment(
    postId: number,
    content: string
  ): Observable<unknown>;

}