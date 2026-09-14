import { Observable } from 'rxjs';
import { AdminUser } from '../entity/admin-user.entity';

export interface PagedAdminUsers {
  users: AdminUser[];
  totalPages: number;
  currentPage: number;
}

export abstract class AdminUserRepository {
  abstract getUsers(page: number): Observable<PagedAdminUsers>;
  abstract banUser(id: number): Observable<AdminUser>;
  abstract unbanUser(id: number): Observable<AdminUser>;
  abstract deleteUser(id: number): Observable<void>;
}
