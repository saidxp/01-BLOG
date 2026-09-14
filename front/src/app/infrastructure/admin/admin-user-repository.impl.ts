import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, map, catchError, throwError } from 'rxjs';
import { AdminUserRepository, PagedAdminUsers } from '../../domain/admin/repository/admin-user.repository'; 
import { AdminUser } from '../../domain/admin/entity/admin-user.entity';
import { AdminUserDto, AdminUserPageDto } from './dto/admin-user.dto';
import { toAdminUserEntity } from './mapper/admin-user.mapper';
import { environment } from '../../../environments/environment.development';

@Injectable()
export class AdminUserRepositoryImpl extends AdminUserRepository {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/api/admin/users`;

  override getUsers(page: number): Observable<PagedAdminUsers> {
    const params = new HttpParams().set('page', page).set('size', 20);

    return this.http
      .get<AdminUserPageDto>(this.baseUrl, { params, withCredentials: true })
      .pipe(
        map((pageDto) => ({
          users: pageDto.content.map(toAdminUserEntity),
          totalPages: pageDto.totalPages,
          currentPage: pageDto.number,
        })),
        catchError(() => throwError(() => new Error('Failed to load users.')))
      );
  }

  override banUser(id: number): Observable<AdminUser> {
    return this.http
      .patch<AdminUserDto>(`${this.baseUrl}/${id}/ban`, {}, { withCredentials: true })
      .pipe(map(toAdminUserEntity), catchError(() => throwError(() => new Error('Failed to ban user.'))));
  }

  override unbanUser(id: number): Observable<AdminUser> {
    return this.http
      .patch<AdminUserDto>(`${this.baseUrl}/${id}/unban`, {}, { withCredentials: true })
      .pipe(map(toAdminUserEntity), catchError(() => throwError(() => new Error('Failed to unban user.'))));
  }

  override deleteUser(id: number): Observable<void> {
    return this.http
      .delete<void>(`${this.baseUrl}/${id}`, { withCredentials: true })
      .pipe(catchError(() => throwError(() => new Error('Failed to delete user.'))));
  }

}