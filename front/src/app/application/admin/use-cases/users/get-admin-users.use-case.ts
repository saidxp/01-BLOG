import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { AdminUserRepository, PagedAdminUsers } from '../../../../domain/admin/repository/admin-user.repository';

@Injectable({ providedIn: 'root' })
export class GetAdminUsersUseCase {
  private readonly adminUserRepository = inject(AdminUserRepository);

  execute(page: number = 0): Observable<PagedAdminUsers> {
    return this.adminUserRepository.getUsers(page);
  }
  
}