import { Component, inject, signal, OnInit } from '@angular/core';
import {GetFeedPrivateUseCase} from '../../../../../../application/post/use-cases/get-private-feed-use-case';
import { Post } from '../../../../../../domain/post/entity/post.entity';
import { PostCardComponent } from '../../../../../shared/components/post-card/post-card.component';
import { AuthNavigationService } from '../../../../../../application/auth/services/auth-navigation.service';

@Component({
  selector: 'app-private-posts-feed',
  standalone: true,
  imports: [PostCardComponent],
  templateUrl: './private-posts-feed.component.html',
  styleUrl: './private-posts-feed.component.css',
})

export class PrivatePostsFeed implements OnInit {

  private readonly getPostsPrivate = inject(GetFeedPrivateUseCase);
  private readonly authNavigation = inject(AuthNavigationService);

  readonly posts = signal<Post[]>([]);
  readonly isLoading = signal(true);
  readonly isLoadingMore = signal(false);
  readonly errorMessage = signal<string | null>(null);

  private currentPage = 0;
  private totalPages = 1;

  ngOnInit(): void { 
    this.loadPosts(0, false, this.isLoading);
  }

  loadMore(): void {
    if (this.currentPage + 1 < this.totalPages) {
      this.loadPosts(this.currentPage + 1, true, this.isLoadingMore);
     }
  }

  get hasMore(): boolean {
    return this.currentPage + 1 < this.totalPages;
  }

  private loadPosts(page: number, append: boolean, loadingSignal: typeof this.isLoading): void {
    loadingSignal.set(true);

    this.getPostsPrivate.execute(page).subscribe({ 

      next: (result) => {
        this.currentPage = result.currentPage;
        this.totalPages = result.totalPages;

        if (append) {
          this.posts.update((existing) => [...existing, ...result.posts]);
        } else {
          this.posts.set(result.posts);
        }
        loadingSignal.set(false);

      }, 
      error: (err) => {
        loadingSignal.set(false);
        if (err.status === 401) {
          this.authNavigation.handle401(err);
          return;
        }
        this.errorMessage.set(err.error?.message ?? 'Could not load your feed.');
      },
    });
  }
}