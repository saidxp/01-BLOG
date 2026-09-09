import { Observable } from 'rxjs';
import { LikeStatus } from '../entity/like-status.entity';

export abstract class LikeRepository {
  abstract like(postId: number): Observable<LikeStatus>;
  abstract unlike(postId: number): Observable<LikeStatus>;
}