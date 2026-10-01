// application/auth/use-cases/logout.use-case.ts
import { Injectable, inject } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { AuthRepository } from '../../../domain/auth/repositories/auth.repository';
import { AuthState } from '../state/auth-state.service';
import { WebSocketNotificationService } from '../../../infrastructure/notification/websocket-notification.service';

@Injectable({ providedIn: 'root' })
export class LogoutUseCase {

  private readonly authRepository = inject(AuthRepository);
  private readonly authState = inject(AuthState);
  private readonly webSocketNotificationService = inject(WebSocketNotificationService);

  execute(): Observable<void> {
    return this.authRepository.logout().pipe(
      tap(() => {
        this.authState.clearUser();
        this.webSocketNotificationService.disconnect();
      })
    );
  } // <<===>> \\ {<-km 0->}
}