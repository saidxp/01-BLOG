import { Observable } from 'rxjs';
import { Post } from '../entity/post.entity';

export abstract class PostRepository {   
  abstract getFeed(): Observable<Post[]>;
} 
// add layout home and auth 
// dquote> - add new post-card 
// dquote> - add shared componet             git sta