import { Injectable, signal } from '@angular/core';
import { Notification } from '../../../domain/notification/entity/notification.entity'; 

@Injectable({ providedIn: 'root' })

//
export class NotificationState {

    private readonly _unreadCount = signal(0);

    private readonly _notifications = signal<Notification[]>([]);

    readonly unreadCount = this._unreadCount.asReadonly();

    readonly notifications = this._notifications.asReadonly();

    setUnreadCount(count: number): void {
        this._unreadCount.set(count);
    }

    // This for set in the first 
    setNotifications(notifications: Notification[]): void {
        this._notifications.set(notifications);
    }
    // This for load More 
    addNotifications(notifications: Notification[]): void {
        this._notifications.update((list) => [...list, ...notifications]);
    }

    // Probably I Will Use In Web Socket End To End <=> (!).
    addNotification(notification: Notification): void { 
        this._notifications.update((list) => [notification, ...list]);
        this._unreadCount.update((count) => count + 1);
    }
    
    decrement(): void {
        this._unreadCount.update((count) => Math.max(0, count - 1));
    }  
}