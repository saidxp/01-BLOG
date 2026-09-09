import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { PostUpdateRepository } from '../../../domain/post/repositories/post-update.repository';

@Injectable({ providedIn: 'root' })
export class UpdatePostUseCase {

  // <<===>> \\ (<!>)... 
  private readonly postUpdateRepository = inject(PostUpdateRepository);

  execute(id: number, title: string, content: string, file: File | null): Observable<number> {
    return this.postUpdateRepository.updatePost(id, title, content, file);
  }

  executeuploadInlineImage(file: File): Observable<string> {
    return this.postUpdateRepository.uploadInlineImage(file)
  }
  // <<==>> \\ (<!!>) \\ (<!!>) (!!)
}
