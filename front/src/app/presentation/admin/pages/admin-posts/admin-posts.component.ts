import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GetAdminPostsUseCase } from '../../../../application/admin/use-cases/posts/get-admin-posts.use-case'
import { AdminDeletePostUseCase } from  '../../../../application/admin/use-cases/posts/admin-delete-post.use-case'
import { AdminPost } from '../../../../domain/admin/entity/admin-post.entity';
import { RouterLink } from '@angular/router';
import { ConfirmModalComponent } from '../../../shared/components/confirm-modal/confirm-modal.component';

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

  readonly posts = signal<AdminPost[]>([]);
  readonly isLoading = signal(true);
  readonly errorMessage = signal<string | null>(null);
  readonly pendingDelete = signal<AdminPost | null>(null);
  readonly isDeleteSubmitting = signal(false);

  private currentPage = 0;
  private totalPages = 1;

  ngOnInit(): void {
    this.loadPosts(0);
  }

  loadMore(): void {
    if (this.currentPage + 1 < this.totalPages) {
      this.loadPosts(this.currentPage + 1);
    }
  }

  get hasMore(): boolean {
    return this.currentPage + 1 < this.totalPages;
  }

  private loadPosts(page: number): void {
    this.isLoading.set(true);
    this.getAdminPostsUseCase.execute(page).subscribe({
      next: (result) => {
        this.currentPage = result.currentPage;
        this.totalPages = result.totalPages;
        this.posts.set(page === 0 ? result.posts : [...this.posts(), ...result.posts]);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.errorMessage.set(err.message);
        this.isLoading.set(false);
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

    this.isDeleteSubmitting.set(true);
    this.adminDeletePostUseCase.execute(post.id).subscribe({
      next: () => {
        this.posts.update((list) => list.filter((p) => p.id !== post.id));
        this.isDeleteSubmitting.set(false);
        this.pendingDelete.set(null);
      },
      error: () => this.isDeleteSubmitting.set(false),
    });
  }
}
