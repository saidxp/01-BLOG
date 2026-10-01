import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GetAdminUsersUseCase } from '../../../../application/admin/use-cases/users/get-admin-users.use-case';
import { ToggleUserBanUseCase } from '../../../../application/admin/use-cases/users/toggle-user-ban.use-case';
import { DeleteUserUseCase } from '../../../../application/admin/use-cases/users/delete-user.use-case';
import { AdminUser } from '../../../../domain/admin/entity/admin-user.entity';
import { UserStatus } from '../../../../enum/UserStatus';
import { ConfirmModalComponent } from '../../../shared/components/confirm-modal/confirm-modal.component';

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

  readonly users = signal<AdminUser[]>([]);
  readonly isLoading = signal(true);
  readonly errorMessage = signal<string | null>(null);
  readonly pendingAction = signal<PendingUserAction | null>(null);
  readonly isActionSubmitting = signal(false);

  private currentPage = 0;
  private totalPages = 1;

  ngOnInit(): void {
    this.loadUsers(0);
  }

  loadMore(): void {
    if (this.currentPage + 1 < this.totalPages) {
      this.loadUsers(this.currentPage + 1);
    }
  }

  get hasMore(): boolean {
    return this.currentPage + 1 < this.totalPages;
  }

  private loadUsers(page: number): void {
    this.isLoading.set(true);
    this.getAdminUsersUseCase.execute(page).subscribe({
      next: (result) => {
        this.currentPage = result.currentPage;
        this.totalPages = result.totalPages;
        this.users.set(page === 0 ? result.users : [...this.users(), ...result.users]);
        this.isLoading.set(false);
      }, 
      
      error: (err) => {
        this.errorMessage.set(err.message);
        this.isLoading.set(false);
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
    this.isActionSubmitting.set(true);
    this.toggleUserBanUseCase.execute(user.id, isBanned).subscribe({
      next: (updatedUser) => {
        this.users.update((list) => list.map((u) => (u.id === updatedUser.id ? updatedUser : u)));
        this.finishPendingAction();
      },
      error: () => this.isActionSubmitting.set(false),
    });
  } 

  private deleteUser(user: AdminUser): void {
    this.isActionSubmitting.set(true);
    this.deleteUserUseCase.execute(user.id).subscribe({
      next: () => {
        this.users.update((list) => list.filter((u) => u.id !== user.id));
        this.finishPendingAction();
      },
      error: () => this.isActionSubmitting.set(false),
    });
  }

  private finishPendingAction(): void {
    this.isActionSubmitting.set(false);
    this.pendingAction.set(null);
  }

}
