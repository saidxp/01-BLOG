import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { GetNotificationsUseCase } from '../../../../application/notification/use-cases/get-notifications.use-case';
import { MarkNotificationReadUseCase } from '../../../../application/notification/use-cases/mark-notification-read.use-case';
import { NotificationState } from '../../../../application/notification/state/notification-state.service';
import { Notification } from '../../../../domain/notification/entity/notification.entity';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.css',
})
export class NotificationsComponent implements OnInit {
  private readonly getNotificationsUseCase = inject(GetNotificationsUseCase);
  private readonly markNotificationReadUseCase = inject(MarkNotificationReadUseCase);
  private readonly notificationState = inject(NotificationState);
  private readonly router = inject(Router);

  // read directly from shared state, instead of a local signal
  readonly notifications = this.notificationState.notifications;

  readonly isLoading = signal(true);
  readonly isLoadingMore = signal(false);
  readonly errorMessage = signal<string | null>(null);
  
  private currentPage = 0;
  private totalPages = 1;

  ngOnInit(): void {
    this.loadNotifications(0, false, this.isLoading);
  }

  loadMore(): void {
    if (this.currentPage + 1 < this.totalPages) {
      this.loadNotifications(this.currentPage + 1, true, this.isLoadingMore);
    }
  }

  get hasMore(): boolean {
    return this.currentPage + 1 < this.totalPages;
  }

  private loadNotifications(page: number, append: boolean, loadingSignal: typeof this.isLoading): void {
    loadingSignal.set(true);

    this.getNotificationsUseCase.execute(page).subscribe({
      next: (result) => {
        this.currentPage = result.currentPage;
        this.totalPages = result.totalPages;

        if (append) {
          this.notificationState.addNotifications(result.notifications);
        } else {
          this.notificationState.setNotifications(result.notifications);
        }

        loadingSignal.set(false);
      },
      error: (err) => {
        this.errorMessage.set(err.message);
        loadingSignal.set(false);
      },
    });
  }

  onNotificationClick(notification: Notification): void {
    if (!notification.read) {
      this.markNotificationReadUseCase.execute(notification.id).subscribe({
        next: () => {
          // update the shared state's list, marking this one read
          const updated = this.notifications().map((n) =>
            n.id === notification.id ? { ...n, read: true } : n
          );
          this.notificationState.setNotifications(updated);
          this.notificationState.decrement();
        },
      });
    }

    this.router.navigateByUrl(`/post/${notification.postId}`);
  }
}