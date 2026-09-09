import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { PostWriteRepository } from '../../../domain/post/repositories/post-write.repository';

@Injectable({ providedIn: 'root' })
export class CreatePostUseCase {
  private readonly postWriteRepository = inject(PostWriteRepository);

  execute(title: string, content: string, media: File | null): Observable<number> {
    return this.postWriteRepository.createPost(title, content, media);
  }

  executeuploadInlineImage(file: File): Observable<string> {
    return this.postWriteRepository.uploadInlineImage(file)
  }
  // <<==>> \\ This Where I Can Upload Image or Video (!!)
}