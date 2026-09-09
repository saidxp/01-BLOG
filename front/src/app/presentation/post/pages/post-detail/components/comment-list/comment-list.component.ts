import { Component, inject, input, signal, OnInit } from '@angular/core';
import { GetCommentsUseCase } from '../../../../../../application/comments/use-cases/get-comments.use-case'
import { Comment } from '../../../../../../domain/comment/entity/comment.entity';

@Component({
  selector: 'app-comment-list',
  standalone: true,
  templateUrl: './comment-list.component.html',
  styleUrl: './comment-list.component.css',
}) 

export class CommentListComponent implements OnInit {
    
  private readonly getCommentsUseCase = inject(GetCommentsUseCase);
  readonly postId = input.required<number>();

  readonly comments = signal<Comment[]>([]);
  readonly isLoading = signal(true);
  readonly errorMessage = signal<string | null>(null);

  private currentPage = 0;
  private totalPages = 1;

  ngOnInit(): void {
    this.loadComments(0);
  }

  reload(): void {
    this.loadComments(0);
  }

  loadMore(): void {
    if (this.currentPage + 1 < this.totalPages) {
      this.loadComments(this.currentPage + 1, true);
    }
  }

  get hasMore(): boolean {
    return this.currentPage + 1 < this.totalPages;
  }

  private loadComments(page: number, mojodlkhir: boolean = false): void {
    this.isLoading.set(true);

    this.getCommentsUseCase.execute(this.postId(), page).subscribe({
      next: (result) => {

        this.currentPage = result.currentPage;
        this.totalPages = result.totalPages;

        if (mojodlkhir) {
          this.comments.update((existing) => [...existing, ...result.comments]);
        } else {
          this.comments.set(result.comments);
        }
        this.isLoading.set(false); 

      },
      error: (err) => {
        this.errorMessage.set(err.message);
        this.isLoading.set(false);
      },
    });
  }
}