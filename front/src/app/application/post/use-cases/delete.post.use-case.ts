import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { PostRepository  } from '../../../domain/post/repositories/post.repository';



@Injectable({ providedIn: 'root' })
export class  DeletePostUseCase { 
  private readonly PostRepository = inject(PostRepository ); 
  // <<==>> \\ {
  // <-->}
  execute(id: number): Observable<void> {
    return this.PostRepository.deletePost(id);
  }
}

