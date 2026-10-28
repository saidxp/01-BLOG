import { Component, inject, signal } from '@angular/core';
import { Router, RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { LogoutUseCase } from '../../../../application/auth/use-cases/logout.use-case';
import { WebSocketNotificationService } from '../../../../infrastructure/notification/websocket-notification.service';
import { AuthNavigationService } from '../../../../application/auth/services/auth-navigation.service';
import { ToastService } from '../../../../application/auth/services/toast.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.css',
})
export class AdminLayoutComponent {
  private readonly logoutUseCase = inject(LogoutUseCase);
  private readonly webSocketNotificationService = inject(WebSocketNotificationService);
  private readonly authNavigation = inject(AuthNavigationService);
  private readonly toast = inject(ToastService);
  private readonly router = inject(Router);

  readonly isLoggingOut = signal(false);

  // Same flow as the site header: clear the session, drop the WebSocket,
  // then leave the admin area (an anonymous visitor has nothing to do here).
  logout(): void {
    if (this.isLoggingOut()) return;
    this.isLoggingOut.set(true);

    this.logoutUseCase.execute().subscribe({
      next: () => {
        this.webSocketNotificationService.disconnect();
        this.isLoggingOut.set(false);
        this.toast.success('Logged out.');
        void this.router.navigate(['/']);
      },
      error: (err) => {
        this.isLoggingOut.set(false);
        if (err.status === 401) {
          this.authNavigation.handle401(err);
          return;
        }
        this.toast.error(err.error?.message ?? 'Could not log out. Please try again.');
      },
    });
  }
}
