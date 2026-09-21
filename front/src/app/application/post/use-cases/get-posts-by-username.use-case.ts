// application/feed/use-cases/get-posts-by-username.use-case.ts
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { PostRepository, PagedPosts } from '../../../domain/post/repositories/post.repository';


@Injectable({ providedIn: 'root' })
export class GetPostsByUsernameUseCase {
  
  private readonly postRepository = inject(PostRepository);

  execute(username: string, page: number): Observable<PagedPosts> {
    return this.postRepository.getPostsByUsername(username, page);
  }

  // <<==>> \\ {<-!!->} // <<==>> \\  
}