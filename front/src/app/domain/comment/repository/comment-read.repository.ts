import { Observable } from 'rxjs';
import { Comment } from '../entity/comment.entity';

export interface PagedComments {
  comments: Comment[];
  totalPages: number;
  currentPage: number;
}

export abstract class CommentReadRepository {

  abstract getComments(postId: number, page: number): Observable<PagedComments>; // <<==>> \\
  abstract deleteComment(postId: number, commentId: number): Observable<void>; // <<==>> \\ 
}

// <<==>> \\  (<!!>).