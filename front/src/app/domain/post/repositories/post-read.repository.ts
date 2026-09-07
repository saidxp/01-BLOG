import { Observable } from 'rxjs';
import { PostDetail } from '../entity/PostDetail';

export abstract class PostReadRepository {
  abstract getPostById(id: number): Observable<PostDetail>;
} // <<==>> \\  
