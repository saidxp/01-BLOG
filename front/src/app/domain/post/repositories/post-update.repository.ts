import { Observable } from 'rxjs';

export abstract class PostUpdateRepository {

  abstract uploadInlineImage(file: File): Observable<string>;  
  abstract updatePost(id: number, title: string, content: string, file: File | null): Observable<number>;
  
}