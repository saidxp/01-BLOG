import { Observable } from 'rxjs';
import { AdminPost } from '../entity/admin-post.entity';

export interface PagedAdminPosts {
  posts: AdminPost[];
  totalPages: number;
  currentPage: number;
}

export abstract class AdminPostRepository {
  abstract getPosts(page: number): Observable<PagedAdminPosts>;
  abstract deletePost(id: number): Observable<void>;
} 