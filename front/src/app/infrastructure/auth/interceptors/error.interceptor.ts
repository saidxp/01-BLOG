import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { ToastService } from '../../../application/auth/services/toast.service';

const ERROR_PAGES = ['/forbidden', '/server-error', '/no-network'];

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const toast = inject(ToastService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // Rate limiting (Layer 2, Bucket4j): friendly, de-duplicated notice for 429.
      // We still rethrow so components reset their in-flight signals (buttons re-enable).
      if (error.status === 429) {
        const message = error.error?.message ?? 'Too many requests. Please slow down.';
        toast.error(message);
        return throwError(() => error);
      }

      const onErrorPage = ERROR_PAGES.some((p) => router.url.startsWith(p));
      const isPageLoad = req.method === 'GET';

      if (isPageLoad && !onErrorPage) {
        if (error.status === 0) {
          router.navigate(['/no-network'], { skipLocationChange: true });
        } else if (error.status === 403) {
          router.navigate(['/forbidden'], { skipLocationChange: true });
        } else if (error.status >= 500) {
          router.navigate(['/server-error'], { skipLocationChange: true });
        }
      }

      return throwError(() => error);
    })
  );
};