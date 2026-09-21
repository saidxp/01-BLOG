import { Observable } from 'rxjs';
import { Post } from '../entity/post.entity';

export interface PagedPosts {
  posts: Post[];
  totalPages: number;
  currentPage: number;
}

export abstract class PostRepository { 
  abstract getFeed(page: number): Observable<PagedPosts>;
  abstract getPostsByUsername(username: string, page: number): Observable<PagedPosts>;
  abstract getSubscriptionfeed(page: number): Observable<PagedPosts>;
}