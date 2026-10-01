import { Component, HostListener, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthState } from '../../../../application/auth/state/auth-state.service';
import { GetUnreadCountUseCase } from '../../../../application/notification/use-cases/get-unread-count.use-case';
import { NotificationState } from '../../../../application/notification/state/notification-state.service';
import { WebSocketNotificationService } from '../../../../infrastructure/notification/websocket-notification.service';
import { LogoutUseCase } from '../../../../application/auth/use-cases/logout.use-case';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})

export class HeaderComponent implements OnInit {
  private readonly authState = inject(AuthState);
  private readonly getUnreadCountUseCase = inject(GetUnreadCountUseCase);
  private readonly notificationState = inject(NotificationState);
  private readonly webSocketNotificationService = inject(WebSocketNotificationService);
  private readonly logoutUseCase = inject(LogoutUseCase);
  private readonly router = inject(Router);

  isUserMenuOpen = signal(false);
  isMobileMenuOpen = signal(false);

  readonly currentUser = this.authState.currentUser;
  readonly unreadCount = this.notificationState.unreadCount;

  ngOnInit(): void {
    if (this.currentUser()) {
      this.getUnreadCountUseCase.execute().subscribe({
        next: (count) => this.notificationState.setUnreadCount(count),
      });
      this.webSocketNotificationService.connect();
    }
  }

  toggleUserMenu(): void {
    this.isMobileMenuOpen.set(false);
    this.isUserMenuOpen.update(open => !open);
  }

  toggleMobileMenu(): void {
    this.isUserMenuOpen.set(false);
    this.isMobileMenuOpen.update(open => !open);
  }

  closeMenus(): void {
    this.isUserMenuOpen.set(false);
    this.isMobileMenuOpen.set(false);
  }

  @HostListener('document:keydown.escape')
  closeMenusOnEscape(): void {
    this.closeMenus();
  }

  @HostListener('document:click', ['$event'])
  closeMenusOnOutsideClick(event: Event): void {
    const target = event.target;
    if (target instanceof Element && !target.closest('.app-header')) {
      this.closeMenus();
    }
  }

  logout(): void {
    this.closeMenus();
    this.logoutUseCase.execute().subscribe({
      next: () => this.router.navigateByUrl('/'),
    });
    
  }
}
