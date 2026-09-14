import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { PagedPosts, PostRepository } from '../../../domain/post/repositories/post.repository';

@Injectable({ providedIn: 'root' }) 

export class GetFeedUseCase {

  private readonly postRepository = inject(PostRepository);
  execute(page : number): Observable<PagedPosts> {
    return this.postRepository.getFeed(page);
  }   
}