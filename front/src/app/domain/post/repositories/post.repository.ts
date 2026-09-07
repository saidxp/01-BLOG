import { Observable } from 'rxjs';
import { Post } from '../entity/post.entity';

export abstract class PostRepository {   
  abstract getFeed(): Observable<Post[]>;
}