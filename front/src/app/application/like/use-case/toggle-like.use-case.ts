import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { LikeRepository } from '../../../domain/like/repository/like.repository';
import { LikeStatus } from '../../../domain/like/entity/like-status.entity';

@Injectable({ providedIn: 'root' })
export class ToggleLikeUseCase {
    private readonly likeRepository = inject(LikeRepository);
    execute(postId: number, currentlyLiked: boolean): Observable<LikeStatus> {
        return currentlyLiked ? this.likeRepository.unlike(postId) : this.likeRepository.like(postId);
    } //<<==>>\\ (!!) <==>> // (!!) 
}