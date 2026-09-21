import { Component, inject, OnInit, signal } from '@angular/core';
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

  // <<==>> \\ {<!!>} // <<==>> \\ {<!!>} \\ 
  private readonly authState = inject(AuthState);

  // 
  private readonly getUnreadCountUseCase = inject(GetUnreadCountUseCase);
  private readonly notificationState = inject(NotificationState);
  private readonly webSocketNotificationService = inject(WebSocketNotificationService);

  private readonly logoutUseCase = inject(LogoutUseCase);
  private readonly router = inject(Router);


  isUserMenuOpen = signal(false);

  readonly currentUser = this.authState.currentUser;
  readonly unreadCount = this.notificationState.unreadCount;

  ngOnInit(): void {
    if (this.currentUser()) {
      this.getUnreadCountUseCase.execute().subscribe({
        next: (count) => this.notificationState.setUnreadCount(count),
      });
      console.log()
      this.webSocketNotificationService.connect(); // connection it's ping 
    }
  } 
  
  // <<==>> \\
  toggleUserMenu(): void {
    this.isUserMenuOpen.update(open => !open);
  }

  logout(): void {
    this.logoutUseCase.execute().subscribe({
      next: () => this.router.navigateByUrl('/'),
    });
  }
  // <<==>> \\ {} {} {} \\ {<!!>} \\{}//
}