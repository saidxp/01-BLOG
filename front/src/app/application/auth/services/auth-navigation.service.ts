import { Injectable, inject } from '@angular/core';
import { Router, UrlTree } from '@angular/router';
import { AuthState } from '../state/auth-state.service';

@Injectable({ providedIn: 'root' })
export class AuthNavigationService {
  private readonly authState = inject(AuthState);
  private readonly router = inject(Router);

  isAuthenticated(): boolean {
    return this.authState.currentUser() !== null;
  }

  requireAuthentication(returnUrl = this.router.url): boolean {
    if (this.isAuthenticated()) {
      return true;
    }

    void this.router.navigateByUrl(this.loginUrl(returnUrl));
    return false;
  }

  loginUrl(returnUrl: string): UrlTree {
    return this.router.createUrlTree(['/login'], {
      queryParams: { returnUrl: this.safeReturnUrl(returnUrl) },
    });
  }

  safeReturnUrl(returnUrl: string | null | undefined): string {
    if (!returnUrl || !returnUrl.startsWith('/') || returnUrl.startsWith('//')) {
      return '/';
    }

    try {
      const parsed = this.router.parseUrl(returnUrl);
      const serialized = this.router.serializeUrl(parsed);
      return serialized.startsWith('/') && !serialized.startsWith('//') ? serialized : '/';
    } catch {
      return '/';
    }
  }
}
