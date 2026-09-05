import { Observable } from 'rxjs';

export abstract class PostWriteRepository {
  abstract createPost(title: string, content: string, media: File | null): Observable<number>; //(<!>)\\
}

 