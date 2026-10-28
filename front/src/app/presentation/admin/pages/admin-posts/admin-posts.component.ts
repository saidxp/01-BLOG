import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GetAdminPostsUseCase } from '../../../../application/admin/use-cases/posts/get-admin-posts.use-case'
import { AdminDeletePostUseCase } from  '../../../../application/admin/use-cases/posts/admin-delete-post.use-case'
import { AdminPost } from '../../../../domain/admin/entity/admin-post.entity';
import { RouterLink } from '@angular/router';
import { ConfirmModalComponent } from '../../../shared/components/confirm-modal/confirm-modal.component';
import { AuthNavigationService } from '../../../../application/auth/services/auth-navigation.service';
import { ToastService } from '../../../../application/auth/services/toast.service';
@Component({
  selector: 'app-admin-posts',
  standalone: true,
  imports: [CommonModule, RouterLink, ConfirmModalComponent],
  templateUrl: './admin-posts.component.html',
  styleUrl: './admin-posts.component.css',
})

export class AdminPostsComponent implements OnInit {
  private readonly getAdminPostsUseCase = inject(GetAdminPostsUseCase);
  private readonly adminDeletePostUseCase = inject(AdminDeletePostUseCase);
  private readonly authNavigation = inject(AuthNavigationService);
  private readonly toastservice = inject(ToastService);

  readonly posts = signal<AdminPost[]>([]);
  readonly isLoading = signal(true);
  readonly errorMessage = signal<string | null>(null);
  readonly actionErrorMessage = signal<string | null>(null);
  readonly pendingDelete = signal<AdminPost | null>(null);
  readonly isDeleteSubmitting = signal(false);

  readonly currentPage = signal(0);
  readonly totalPages = signal(1);

  get hasPrevious(): boolean {
    return this.currentPage() > 0;
  }

  get hasNext(): boolean {
    return this.currentPage() + 1 < this.totalPages();
  }

  ngOnInit(): void {
    this.loadPosts(0);
  }

  previousPage(): void {
    this.goToPage(this.currentPage() - 1);
  }

  nextPage(): void {
    this.goToPage(this.currentPage() + 1);
  }

  private goToPage(page: number): void {
    if (this.isLoading() || page < 0 || page >= this.totalPages()) return;
    this.loadPosts(page);
  }

  private loadPosts(page: number): void {
    this.isLoading.set(true);
    this.getAdminPostsUseCase.execute(page).subscribe({
      next: (result) => {
        this.currentPage.set(result.currentPage);
        this.totalPages.set(result.totalPages);
        this.posts.set(result.posts);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.isLoading.set(false);
        if (err.status === 401) {
          this.authNavigation.handle401(err);
          return;
        }
        this.errorMessage.set(err.error?.message ?? 'Could not load posts.');
      },
    });
  }

  requestDeletePost(post: AdminPost): void {
    this.pendingDelete.set(post);
  }

  cancelDeletePost(): void {
    if (!this.isDeleteSubmitting()) {
      this.pendingDelete.set(null);
    }
  }

  deleteConfirmationMessage(): string {
    const post = this.pendingDelete();
    return post
      ? `The post "${post.title}" will be permanently deleted. This action cannot be undone.`
      : '';
  }

  confirmDeletePost(): void { 

    const post = this.pendingDelete();
    if (!post || this.isDeleteSubmitting()) return;

    this.actionErrorMessage.set(null);
    this.isDeleteSubmitting.set(true);
    this.adminDeletePostUseCase.execute(post.id).subscribe({ 
      next: () => {
        this.posts.update((list) => list.filter((p) => p.id !== post.id));
        this.isDeleteSubmitting.set(false);
        this.pendingDelete.set(null);
        this.toastservice.success("post deleted");
      }, 
      error: (err) => {
        this.isDeleteSubmitting.set(false);
        this.pendingDelete.set(null);
        if (err.status === 401) {
          this.authNavigation.handle401(err);
          return;
        }
        this.actionErrorMessage.set(err.error?.message ?? 'Could not delete this post.');
      },
    });
  } 
  // {<!!>}
}
