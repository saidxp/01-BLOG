import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { CommentRepository } from '../../domain/comment/repository/comment.repository';
import { environment } from '../../../environments/environment.development';

@Injectable()
export class CommentRepositoryImpl extends CommentRepository {

    private readonly http = inject(HttpClient);

    private readonly baseUrl = `${environment.apiUrl}/api/posts`;

    override addComment( postId: number, content: string): Observable<unknown> {
        const params = new HttpParams() .set('content', content);
        return this.http.post(`${this.baseUrl}/${postId}/comments`, null , { params, withCredentials: true } );
    } // <<==>> 
     
}