import { Injectable, inject } from '@angular/core';
import { Router, UrlTree } from '@angular/router';
import { AuthState } from '../state/auth-state.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment.development';
import { finalize } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthNavigationService {

  private readonly authState = inject(AuthState);
  private readonly router = inject(Router);
  private readonly http = inject(HttpClient)

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

  // Call this inside the error handler of any authenticated API call.
  // If the server returns 401 it means the session expired —
  // clear the local user state and redirect to /login.

  handle401(err: { status?: number }): void {
    if (err.status !== 401) return;

    this.http.post(
      `${environment.apiUrl}/api/auth/clear-session`,
      {},
      { withCredentials: true }
    ).pipe(
      finalize(() => {
        this.authState.clearUser();
        void this.router.navigate(['/login']);
      })
    ).subscribe({
      error: () => {
        // AuthState is still cleared in finalize.
      }
    });
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
