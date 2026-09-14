import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GetAdminUsersUseCase } from '../../../../application/admin/use-cases/users/get-admin-users.use-case';
import { ToggleUserBanUseCase } from '../../../../application/admin/use-cases/users/toggle-user-ban.use-case';
import { DeleteUserUseCase } from '../../../../application/admin/use-cases/users/delete-user.use-case';
import { AdminUser } from '../../../../domain/admin/entity/admin-user.entity';
import { UserStatus } from '../../../../enum/UserStatus';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule],
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

  toggleBan(user: AdminUser): void { 
    const isBanned = user.status === UserStatus.BANNED;
    this.toggleUserBanUseCase.execute(user.id, isBanned).subscribe({
      next: (updatedUser) => {
        this.users.update((list) => list.map((u) => (u.id === updatedUser.id ? updatedUser : u)));
      },
    });
  } 

  deleteUser(user: AdminUser): void { 
    if (!confirm(`Delete user "${user.username}"? This cannot be undone.`)) return;

    this.deleteUserUseCase.execute(user.id).subscribe({
      next: () => {
        this.users.update((list) => list.filter((u) => u.id !== user.id));
      },
    });
  }

}