import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthRepository } from '../../../domain/auth/repositories/auth.repository';
import { User } from '../../../domain/auth/entities/user.entity';

@Injectable({ providedIn: 'root' })
export class LoginUseCase {
    // Inject The Class Her (!) ... 
  private readonly authRepository = inject(AuthRepository);
  execute(identifier: string, password: string): Observable<User> {
    return this.authRepository.login(identifier, password);
  }
}