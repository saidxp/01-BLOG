import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, map, catchError, throwError } from 'rxjs';
import { CommentReadRepository, PagedComments } from '../../domain/comment/repository/comment-read.repository';
import { CommentDto, PageDto } from './dto/comment.dto';
import { toCommentEntity } from './mapper/comment.mapper';
import { environment } from '../../../environments/environment.development';

@Injectable()
export class CommentReadRepositoryImpl extends CommentReadRepository {

    private readonly http = inject(HttpClient);
    override getComments(postId: number, page: number): Observable<PagedComments> {
        const params = new HttpParams().set('page', page).set('size', 10);
        return this.http
            .get<PageDto<CommentDto>>(`${environment.apiUrl}/api/posts/${postId}/comments`, { params, withCredentials: true })
            .pipe(
                map((pageDto) => ({
                    comments: pageDto.content.map(toCommentEntity),
                    totalPages: pageDto.totalPages,
                    currentPage: pageDto.number,
                })),
                catchError((err: HttpErrorResponse) => {
                    return throwError(() => new Error('Failed to load comments.'));
                })
            );
    }

    override deleteComment(postId: number, commentId: number): Observable<void> {
        return this.http
            .delete<void>(`${environment.apiUrl}/api/posts/${postId}/comments/${commentId}`, { withCredentials: true })
            .pipe(
                catchError((err: HttpErrorResponse) =>
                    throwError(() => new Error(err.error?.message ?? 'Failed to delete comment.'))
                )
            );
    }
}