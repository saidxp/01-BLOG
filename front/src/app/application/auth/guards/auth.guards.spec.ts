import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, provideRouter, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Role } from '../../../enum/Role';
import { User } from '../../../domain/auth/entities/user.entity';
import { AuthState } from '../state/auth-state.service';
import { adminGuard, authGuard } from './auth.guards';

describe('authentication guards', () => {
  const currentUser = signal<User | null>(null);

  beforeEach(() => {
    currentUser.set(null);
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        { provide: AuthState, useValue: { currentUser: currentUser.asReadonly() } },
      ],
    });
  });

  it('redirects a guest to login with the protected URL', () => {
    const result = TestBed.runInInjectionContext(() =>
      authGuard({} as ActivatedRouteSnapshot, { url: '/new' } as RouterStateSnapshot)
    );

    expect(result instanceof UrlTree).toBeTrue();
    if (result instanceof UrlTree) {
      expect(TestBed.inject(Router).serializeUrl(result)).toBe('/login?returnUrl=%2Fnew');
    }
  });

  it('prevents a non-admin user from entering admin routes', () => {
    currentUser.set(new User('1', 'member@example.com', 'member', '', Role.USER));

    const result = TestBed.runInInjectionContext(() =>
      adminGuard({} as ActivatedRouteSnapshot, { url: '/admin/users' } as RouterStateSnapshot)
    );

    expect(result instanceof UrlTree).toBeTrue();
    if (result instanceof UrlTree) {
      expect(TestBed.inject(Router).serializeUrl(result)).toBe('/');
    }
  });
});
