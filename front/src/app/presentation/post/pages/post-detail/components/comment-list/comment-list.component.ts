import { Component, inject, input, signal, OnInit } from '@angular/core';
import { GetCommentsUseCase } from '../../../../../../application/comments/use-cases/get-comments.use-case';
import { DeleteCommentUseCase } from '../../../../../../application/comments/use-cases/delete-comment.use-case';
import { Comment } from '../../../../../../domain/comment/entity/comment.entity'; 
import { ConfirmModalComponent } from '../../../../../shared/components/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-comment-list',
  standalone: true, 
  imports :[ConfirmModalComponent],
  templateUrl: './comment-list.component.html',
  styleUrl: './comment-list.component.css',
})

export class CommentListComponent implements OnInit {
  private readonly getCommentsUseCase = inject(GetCommentsUseCase);
  private readonly deleteCommentUseCase = inject(DeleteCommentUseCase);

  readonly postId = input.required<number>();
  readonly comments = signal<Comment[]>([]);
  readonly isLoading = signal(true);
  readonly isLoadingMore = signal(false);
  readonly errorMessage = signal<string | null>(null); 


  //<<===>>\\
  readonly showDeleteConfirm = signal(false);
  private pendingDeleteId: number | null = null; 
  //<<===>>>\\  


  private currentPage = 0;
  private totalPages = 1;

  ngOnInit(): void {
    this.loadComments(0, false, this.isLoading);
  }

  reload(): void {
    this.loadComments(0, false, this.isLoading);
  }

  loadMore(): void {
    if (this.currentPage + 1 < this.totalPages) {
      this.loadComments(this.currentPage + 1, true, this.isLoadingMore);
    }
  }

  get hasMore(): boolean {
    return this.currentPage + 1 < this.totalPages;
  }

  // <<===>>> \\ {>|<->|<} \\<->// 
  private loadComments(page: number, append: boolean, loadingSignal: typeof this.isLoading): void {
    loadingSignal.set(true);

    this.getCommentsUseCase.execute(this.postId(), page).subscribe({
      next: (result) => {
        this.currentPage = result.currentPage;
        this.totalPages = result.totalPages;

        if (append) {
          this.comments.update((existing) => [...existing, ...result.comments]);
        } else {
          this.comments.set(result.comments);
        }

        loadingSignal.set(false);
      },
      error: (err) => {
        this.errorMessage.set(err.message);
        loadingSignal.set(false);
      },
    });
  }

 
  // <<<====================================================================>> \\ 
  requestDelete(commentId: number): void {
    this.pendingDeleteId = commentId;
    this.showDeleteConfirm.set(true);
  }

  confirmDelete(): void {
    if (this.pendingDeleteId === null) return;

    const idToDelete = this.pendingDeleteId;

    this.deleteCommentUseCase.execute(this.postId(), idToDelete).subscribe({
      next: () => {
        this.comments.update((list) => list.filter((c) => c.id !== idToDelete));
        this.showDeleteConfirm.set(false);
        this.pendingDeleteId = null;
      },
      error: (err) => {
        this.errorMessage.set(err.message);
        this.showDeleteConfirm.set(false);
      },
    });
  } 

  cancelDelete(): void {
    this.showDeleteConfirm.set(false);
    this.pendingDeleteId = null;
  } 
  // <<=====================================================================>> \\
  addCommentLocally(comment: Comment): void {
    this.comments.update((list) => [comment, ...list]);
  }
}