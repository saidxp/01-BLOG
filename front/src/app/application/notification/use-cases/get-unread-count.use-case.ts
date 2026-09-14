import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { NotificationRepository } from '../../../domain/notification/repository/notification.repository';

// <<==>> \\
@Injectable({ providedIn: 'root' })
export class GetUnreadCountUseCase {
  private readonly notificationRepository = inject(NotificationRepository);

  execute(): Observable<number> {
    return this.notificationRepository.getUnreadCount();
  }
}