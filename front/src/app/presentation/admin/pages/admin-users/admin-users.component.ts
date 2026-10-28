import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GetAdminUsersUseCase } from '../../../../application/admin/use-cases/users/get-admin-users.use-case';
import { ToggleUserBanUseCase } from '../../../../application/admin/use-cases/users/toggle-user-ban.use-case';
import { DeleteUserUseCase } from '../../../../application/admin/use-cases/users/delete-user.use-case';
import { AdminUser } from '../../../../domain/admin/entity/admin-user.entity';
import { UserStatus } from '../../../../enum/UserStatus';
import { ConfirmModalComponent } from '../../../shared/components/confirm-modal/confirm-modal.component';
import { AuthNavigationService } from '../../../../application/auth/services/auth-navigation.service';
import { ToastService } from '../../../../application/auth/services/toast.service' 

type PendingUserAction = {
  kind: 'toggle-ban' | 'delete';
  user: AdminUser;
};

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, ConfirmModalComponent],
  templateUrl: './admin-users.component.html',
  styleUrl: './admin-users.component.css',
})
export class AdminUsersComponent implements OnInit {

  private readonly getAdminUsersUseCase = inject(GetAdminUsersUseCase);
  private readonly toggleUserBanUseCase = inject(ToggleUserBanUseCase);
  private readonly deleteUserUseCase = inject(DeleteUserUseCase);
  private readonly authNavigation = inject(AuthNavigationService);
  private readonly toast = inject(ToastService);

  readonly users = signal<AdminUser[]>([]);
  readonly isLoading = signal(true);
  readonly errorMessage = signal<string | null>(null);
  readonly actionErrorMessage = signal<string | null>(null);
  readonly pendingAction = signal<PendingUserAction | null>(null);
  readonly isActionSubmitting = signal(false);

  readonly currentPage = signal(0);
  readonly totalPages = signal(1);

  get hasPrevious(): boolean {
    return this.currentPage() > 0;
  }

  get hasNext(): boolean {
    return this.currentPage() + 1 < this.totalPages();
  }

  ngOnInit(): void {
    this.loadUsers(0);
  }

  previousPage(): void {
    this.goToPage(this.currentPage() - 1);
  }

  nextPage(): void {
    this.goToPage(this.currentPage() + 1);
  }

  private goToPage(page: number): void {
    if (this.isLoading() || page < 0 || page >= this.totalPages()) return;
    this.loadUsers(page);
  }

  private loadUsers(page: number): void {
    this.isLoading.set(true);
    this.getAdminUsersUseCase.execute(page).subscribe({
      next: (result) => {
        this.currentPage.set(result.currentPage);
        this.totalPages.set(result.totalPages);
        this.users.set(result.users);
        this.isLoading.set(false);
      },

      error: (err) => {
        this.isLoading.set(false);
        if (err.status === 401) {
          this.authNavigation.handle401(err);
          return;
        }
        this.errorMessage.set(err.error?.message ?? 'Could not load users.');
      },
    });
  }

  requestToggleBan(user: AdminUser): void {
    this.pendingAction.set({ kind: 'toggle-ban', user });
  }

  requestDeleteUser(user: AdminUser): void {
    this.pendingAction.set({ kind: 'delete', user });
  }

  confirmPendingAction(): void {
    const action = this.pendingAction();
    if (!action || this.isActionSubmitting()) return;

    if (action.kind === 'toggle-ban') {
      this.toggleBan(action.user);
    } else {
      this.deleteUser(action.user);
    }
  }

  cancelPendingAction(): void {
    if (!this.isActionSubmitting()) {
      this.pendingAction.set(null);
    }
  }

  confirmationTitle(): string {
    const action = this.pendingAction();
    if (!action) return 'Confirm action';
    if (action.kind === 'delete') return `Delete ${action.user.username}?`;
    return action.user.status === UserStatus.BANNED
      ? `Unban ${action.user.username}?`
      : `Ban ${action.user.username}?`;
  }

  confirmationMessage(): string {
    const action = this.pendingAction();
    if (!action) return '';
    if (action.kind === 'delete') {
      return 'This user account will be permanently deleted. This action cannot be undone.';
    }
    return action.user.status === UserStatus.BANNED
      ? 'This user will regain access to their account.'
      : 'This user will be blocked from accessing their account until an administrator unbans them.';
  }

  private toggleBan(user: AdminUser): void {
    const isBanned = user.status === UserStatus.BANNED;
    this.actionErrorMessage.set(null);
    this.isActionSubmitting.set(true);
    this.toggleUserBanUseCase.execute(user.id, isBanned).subscribe({
      next: (updatedUser) => {
        this.users.update((list) => list.map((u) => (u.id === updatedUser.id ? updatedUser : u)));
        this.finishPendingAction();
        this.toast.success(isBanned ? 'User unbanned.' : 'User banned.');
      },
      error: (err) => {
        this.isActionSubmitting.set(false);
        this.pendingAction.set(null);
        if (err.status === 401) {
          this.authNavigation.handle401(err);
          return;
        }
        const message = err.error?.message ?? 'Could not update this user.';
        this.actionErrorMessage.set(message);
        this.toast.error(message);
      },
    });
  } 

  private deleteUser(user: AdminUser): void {
    this.actionErrorMessage.set(null);
    this.isActionSubmitting.set(true);
    this.deleteUserUseCase.execute(user.id).subscribe({
      next: () => {
        this.users.update((list) => list.filter((u) => u.id !== user.id));
        this.finishPendingAction();
        this.toast.success('User deleted.');
      },
      error: (err) => {
        this.isActionSubmitting.set(false);
        this.pendingAction.set(null);
        if (err.status === 401) {
          this.authNavigation.handle401(err);
          return;
        }
        const message = err.error?.message ?? 'Could not delete this user.';
        this.actionErrorMessage.set(message);
        this.toast.error(message);
      },
    });
  }

  private finishPendingAction(): void {
    this.isActionSubmitting.set(false);
    this.pendingAction.set(null);
  }

}
