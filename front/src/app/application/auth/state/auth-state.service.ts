import { Injectable, signal } from '@angular/core';
import { User } from '../../../domain/auth/entities/user.entity';

@Injectable({ providedIn: 'root' })
export class AuthState {
  private readonly _currentUser = signal<User | null>(null);

  readonly currentUser = this._currentUser.asReadonly();

  setUser(user: User): void {
    this._currentUser.set(user);
  }

  clearUser(): void {
    this._currentUser.set(null);
  }
}