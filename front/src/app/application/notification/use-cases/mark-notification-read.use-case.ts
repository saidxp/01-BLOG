import { Observable } from "rxjs"; 
import { inject, Injectable} from "@angular/core"; 

import { NotificationRepository } from "../../../domain/notification/repository/notification.repository"; 

@Injectable({ providedIn: 'root' })
export class MarkNotificationReadUseCase {
  private readonly notificationRepository = inject(NotificationRepository);

  execute(id: number): Observable<void> {
    return this.notificationRepository.markAsRead(id);
  }
}