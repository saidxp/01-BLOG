import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { AdminUserRepository } from '../../../../domain/admin/repository/admin-user.repository';
import { AdminUser } from '../../../../domain/admin/entity/admin-user.entity';

@Injectable({ providedIn: 'root' })
export class ToggleUserBanUseCase {

  private readonly adminUserRepository = inject(AdminUserRepository);

  execute(id: number, currentlyBanned: boolean): Observable<AdminUser> {
    return currentlyBanned
      ? this.adminUserRepository.unbanUser(id)
      : this.adminUserRepository.banUser(id);
    }

}