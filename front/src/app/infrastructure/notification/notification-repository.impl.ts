import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { NotificationRepository, PagedNotifications } from '../../domain/notification/repository/notification.repository';
import { NotificationDto, NotificationPageDto } from './dto/notification.dto';
import { toNotificationEntity } from './mapper/notification.mapper';
import { environment } from '../../../environments/environment.development';

@Injectable()
export class NotificationRepositoryImpl extends NotificationRepository {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/api/notifications`;

  override getUnreadCount(): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/unread-count`, { withCredentials: true });
  }

  override getNotifications(page: number): Observable<PagedNotifications> {

    // <<==>> \\ (<!<->!>)
    const params = new HttpParams().set('page', page).set('size', 20);

    return this.http
      .get<NotificationPageDto>(this.baseUrl, { params, withCredentials: true })
      .pipe(
        map((pageDto) => ({
          notifications: pageDto.content.map(toNotificationEntity),
          totalPages: pageDto.totalPages,
          currentPage: pageDto.number,
        }))
      );
  }

  override markAsRead(id: number): Observable<void> {
    return this.http.patch<void>(`${this.baseUrl}/${id}/read`, {}, { withCredentials: true });
  }
  
}