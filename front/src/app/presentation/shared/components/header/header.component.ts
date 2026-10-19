import { Component, HostListener, inject, OnInit, signal } from '@angular/core';
import { Subject, debounceTime, distinctUntilChanged, filter } from 'rxjs';
import { RouterLink } from '@angular/router';
import { AuthState } from '../../../../application/auth/state/auth-state.service';
import { GetUnreadCountUseCase } from '../../../../application/notification/use-cases/get-unread-count.use-case';
import { NotificationState } from '../../../../application/notification/state/notification-state.service';
import { WebSocketNotificationService } from '../../../../infrastructure/notification/websocket-notification.service';
import { LogoutUseCase } from '../../../../application/auth/use-cases/logout.use-case';
import { ThemeService } from '../../../../application/them/themstate';
import { UserSearchResult } from '../../../../domain/profile/entity/user-search-result.entity';
import { SearchUsersUseCase } from '../../../../application/profile/use-cases/search-users.use-case';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})

export class HeaderComponent implements OnInit {

  // <<==>> \\ {<!-!>}
  private readonly authState = inject(AuthState);
  private readonly getUnreadCountUseCase = inject(GetUnreadCountUseCase);
  private readonly notificationState = inject(NotificationState);
  private readonly webSocketNotificationService = inject(WebSocketNotificationService);
  private readonly logoutUseCase = inject(LogoutUseCase);
  private readonly searchUsersUseCase = inject(SearchUsersUseCase);


  private readonly themeService = inject(ThemeService);

  isUserMenuOpen = signal(false);
  isMobileMenuOpen = signal(false)

  // Search Input <<===>> {<!-!>} .
  private searchInput$ = new Subject<string>();
  readonly searchResults = signal<UserSearchResult[]>([]);

  readonly searchQuery = signal('');
  readonly isSearchOpen = signal(false);
  readonly searchLoading = signal(false);
  // <<<<===>>>  
  onSearchInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const query = input.value;

    this.searchQuery.set(query);
    this.isSearchOpen.set(true);
    this.searchInput$.next(query);
  }
  clearSearch(input: HTMLInputElement): void {
    input.value = '';
    this.searchQuery.set('');
    this.searchResults.set([]);
    this.isSearchOpen.set(false);
    this.searchInput$.next('');
  }


  // Tfi -> Och3al -> lpola !!
  toggleTheme(): void {
    this.themeService.toggle();
  }

  readonly currentUser = this.authState.currentUser;
  readonly unreadCount = this.notificationState.unreadCount;

  ngOnInit(): void {
    if (this.currentUser()) {
      this.getUnreadCountUseCase.execute().subscribe({
        next: (count) => this.notificationState.setUnreadCount(count),
      });
      this.webSocketNotificationService.connect();
    }

    this.searchInput$
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        filter(query => query.length >= 2),
      )
      .subscribe((query) => {
        if (query.length < 2) {
          this.searchResults.set([]);
          return;
        }
        this.searchUsersUseCase.execute(query).subscribe({
          next: (users) => this.searchResults.set(users),
          error: () => this.searchResults.set([]),
        });
      });

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
      next: () => this.webSocketNotificationService.disconnect(),
    });
  }
}
