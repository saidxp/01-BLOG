import { Component, inject, signal, OnInit } from '@angular/core';
import {GetFeedUseCase} from '../../../../../../application/post/use-cases/get-feed.use-case';
import { Post } from '../../../../../../domain/post/entity/post.entity';
import { PostCardComponent } from '../../../../../shared/components/post-card/post-card.component';


@Component({
  selector: 'app-public-posts-feed',
  standalone: true,
  imports: [PostCardComponent],
  templateUrl: './public-posts-feed.component.html',
  styleUrl: './public-posts-feed.component.css',
})

export class PublicPostsFeed implements OnInit {

  private readonly getPostsByUsernameUseCase = inject(GetFeedUseCase);

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

    this.getPostsByUsernameUseCase.execute(page).subscribe({
      next: (result) => {
        this.currentPage = result.currentPage;
        this.totalPages = result.totalPages;

        console.log("the posts %d",result);

        if (append) {
          this.posts.update((existing) => [...existing, ...result.posts]);
        } else {
          this.posts.set(result.posts);
        }
        loadingSignal.set(false);
      }, 
      error: (err) => {
        this.errorMessage.set(err.message);
        loadingSignal.set(false);
      },
    });
  }
}