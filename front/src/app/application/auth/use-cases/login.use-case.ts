import { Injectable, inject } from '@angular/core';
import { Observable , tap} from 'rxjs';
import { AuthRepository } from '../../../domain/auth/repositories/auth.repository';
import { User } from '../../../domain/auth/entities/user.entity';
import { AuthState } from '../state/auth-state.service';

@Injectable({ providedIn: 'root' })
export class LoginUseCase {
    // Inject The Class Her (!) ... 
  private readonly authRepository = inject(AuthRepository);
  private readonly authState = inject(AuthState);
  execute(identifier: string, password: string): Observable<User> {
   return this.authRepository.login(identifier, password).pipe(
      tap((user) => this.authState.setUser(user))
    );
    }
}