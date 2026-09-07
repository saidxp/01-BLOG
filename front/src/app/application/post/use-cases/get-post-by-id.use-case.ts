import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { PostReadRepository } from '../../../domain/post/repositories/post-read.repository';
import { PostDetail } from '../../../domain/post/entity/PostDetail';

@Injectable({ providedIn: 'root' })
export class GetPostByIdUseCase { 

  private readonly postReadRepository = inject(PostReadRepository);
  execute(id: number): Observable<PostDetail> {
    return this.postReadRepository.getPostById(id);
  }
  
}