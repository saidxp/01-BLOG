import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { PostRepository } from '../../../domain/home/repository/post.repository';
import { Post } from '../../../domain/home/entity/post.entity';

@Injectable({ providedIn: 'root' })
export class GetFeedUseCase {
    
  private readonly postRepository = inject(PostRepository);

  execute(): Observable<Post[]> {
    return this.postRepository.getFeed();
  }   
}