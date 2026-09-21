// application/auth/use-cases/logout.use-case.ts
import { Injectable, inject } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { AuthRepository } from '../../../domain/auth/repositories/auth.repository';
import { AuthState } from '../state/auth-state.service';

@Injectable({ providedIn: 'root' })
export class LogoutUseCase {

  private readonly authRepository = inject(AuthRepository);
  private readonly authState = inject(AuthState);

  execute(): Observable<void> {
    return this.authRepository.logout().pipe(
      tap(() => this.authState.clearUser())
    );
  } // <<===>> \\ {<-km 0->}
}