import { afterNextRender, Component, DestroyRef, inject, input, signal, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { GetCommentsUseCase } from '../../../../../../application/comments/use-cases/get-comments.use-case';
import { DeleteCommentUseCase } from '../../../../../../application/comments/use-cases/delete-comment.use-case';
import { Comment } from '../../../../../../domain/comment/entity/comment.entity'; 
import { ConfirmModalComponent } from '../../../../../shared/components/confirm-modal/confirm-modal.component';
import { RelativeTimePipe } from '../../../../../shared/pipes/relative-time.pipe';
import { AuthNavigationService } from '../../../../../../application/auth/services/auth-navigation.service';
import { ToastService } from '../../../../../../application/auth/services/toast.service'

@Component({
  selector: 'app-comment-list',
  standalone: true, 
  imports: [ConfirmModalComponent, DatePipe, RelativeTimePipe],
  templateUrl: './comment-list.component.html',
  styleUrl: './comment-list.component.css',
})

export class CommentListComponent implements OnInit { 
  
  private readonly getCommentsUseCase = inject(GetCommentsUseCase);
  private readonly deleteCommentUseCase = inject(DeleteCommentUseCase);
  private readonly destroyRef = inject(DestroyRef);
  private readonly authNavigation = inject(AuthNavigationService);
  private readonly toast = inject(ToastService);

  readonly postId = input.required<number>();
  readonly comments = signal<Comment[]>([]);
  readonly isLoading = signal(true);
  readonly isLoadingMore = signal(false);
  readonly errorMessage = signal<string | null>(null); 
  readonly relativeTimeReady = signal(false);
  readonly relativeTimeTick = signal(Date.now());


  //<<===>>\\
  readonly showDeleteConfirm = signal(false);
  readonly isDeleting = signal(false);
  private pendingDeleteId: number | null = null; 
  //<<===>>>\\  


  private currentPage = 0;
  private totalPages = 1;

  constructor() {
    afterNextRender(() => {
      this.relativeTimeReady.set(true);
      this.relativeTimeTick.set(Date.now());

      const intervalId = setInterval(() => this.relativeTimeTick.set(Date.now()), 60_000);
      this.destroyRef.onDestroy(() => clearInterval(intervalId));
    });
  }

  ngOnInit(): void {
    this.loadComments(0, false, this.isLoading);
  }

  reload(): void {
    this.loadComments(0, false, this.isLoading);
  }

  loadMore(): void {
    if (this.isLoadingMore()) return;
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
        loadingSignal.set(false);
        this.errorMessage.set(err.error?.message ?? 'Could not load comments.');
      },
    });
  }

 
  // <<<====================================================================>> \\ 
  requestDelete(commentId: number): void {
    this.pendingDeleteId = commentId;
    this.showDeleteConfirm.set(true);
  }

  confirmDelete(): void {
    if (this.pendingDeleteId === null || this.isDeleting()) return;

    const idToDelete = this.pendingDeleteId;
    this.isDeleting.set(true);

    this.deleteCommentUseCase.execute(this.postId(), idToDelete).subscribe({
      next: () => {
        this.comments.update((list) => list.filter((c) => c.id !== idToDelete));
        this.isDeleting.set(false);
        this.showDeleteConfirm.set(false);
        this.pendingDeleteId = null;
      },
      error: (err) => {
        this.isDeleting.set(false);
        this.showDeleteConfirm.set(false);
        this.pendingDeleteId = null;
        if (err.status === 401) {
          this.authNavigation.handle401(err);
          return;
        }
        const message = err.error?.message ?? 'Could not delete this comment.';
        this.errorMessage.set(message);
        this.toast.error(message);
      },
    });
  } 

  cancelDelete(): void {
    if (this.isDeleting()) return;
    this.showDeleteConfirm.set(false);
    this.pendingDeleteId = null;
  } 
  // <<=====================================================================>> \\
  addCommentLocally(comment: Comment): void {
    this.comments.update((list) => [comment, ...list]);
  }
}
