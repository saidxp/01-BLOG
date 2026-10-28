import { Component, inject, input, signal, effect } from '@angular/core';
import { GetPostsByUsernameUseCase } from '../../../../../../application/post/use-cases/get-posts-by-username.use-case';
import { Post } from '../../../../../../domain/post/entity/post.entity';
import { PostCardComponent } from '../../../../../shared/components/post-card/post-card.component';

@Component({
  selector: 'app-user-post-list',
  standalone: true,
  imports: [PostCardComponent],
  templateUrl: './user-post-list.component.html',
  styleUrl: './user-post-list.component.css',
})
export class UserPostListComponent {
  private readonly getPostsByUsernameUseCase = inject(GetPostsByUsernameUseCase);

  readonly username = input.required<string>();

  readonly posts = signal<Post[]>([]);
  readonly isLoading = signal(true);
  readonly isLoadingMore = signal(false);
  readonly errorMessage = signal<string | null>(null);

  private currentPage = 0;
  private totalPages = 1;

  constructor() {
    // Reload whenever the username input changes (e.g. navigating between profiles).
    effect(() => {
      const username = this.username();
      if (!username) return;
      this.currentPage = 0;
      this.totalPages = 1;
      this.posts.set([]);
      this.errorMessage.set(null);
      this.loadPosts(0, false, this.isLoading);
    });
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

    this.getPostsByUsernameUseCase.execute(this.username(), page).subscribe({
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
        this.errorMessage.set(err.error?.message ?? 'Could not load this user’s posts.');
      },
    });
  }
}