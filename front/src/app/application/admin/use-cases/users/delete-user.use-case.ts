import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { AdminUserRepository } from '../../../../domain/admin/repository/admin-user.repository'; // <<==>> \\ {<!!>}

@Injectable({ providedIn: 'root' })
export class DeleteUserUseCase {
  private readonly adminUserRepository = inject(AdminUserRepository);

  execute(id: number): Observable<void> {
    return this.adminUserRepository.deleteUser(id);
  }
}