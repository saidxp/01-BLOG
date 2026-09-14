import { Observable } from 'rxjs';
import { Notification } from '../entity/notification.entity';

export interface PagedNotifications {
    notifications: Notification[];
    totalPages: number;
    currentPage: number;
}

export abstract class NotificationRepository {
    abstract getUnreadCount(): Observable<number>;
    abstract getNotifications(page: number): Observable<PagedNotifications>;
    abstract markAsRead(id: number): Observable<void>;
}   // <<==>> \\ (Clean Architect) (!!)