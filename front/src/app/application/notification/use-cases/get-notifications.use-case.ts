import { Observable } from "rxjs"; 
import { inject, Injectable} from "@angular/core"; 

import { NotificationRepository } from "../../../domain/notification/repository/notification.repository"; 
import { PagedNotifications } from "../../../domain/notification/repository/notification.repository"; // <=> \\

@Injectable({ providedIn: 'root' })
export class GetNotificationsUseCase {

  private readonly notificationRepository = inject(NotificationRepository);
  
  execute(page: number = 0): Observable<PagedNotifications> {
    return this.notificationRepository.getNotifications(page);
  }
}