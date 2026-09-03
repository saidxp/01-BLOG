import { HttpInterceptorFn } from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';   
import { isPlatformServer } from '@angular/common';
import { SERVER_REQUEST } from '../../ssr/request.token';

export const cookieForwardingInterceptor: HttpInterceptorFn = (req, next) => {

  const platformId = inject(PLATFORM_ID);

  if (isPlatformServer(platformId)) {
    const request = inject(SERVER_REQUEST, { optional: true });
    const cookieHeader = request?.headers['cookie'];

    if (cookieHeader) {
      req = req.clone({
        setHeaders: { Cookie: cookieHeader },
      });
    }
    // <<==>> \\ (!<->!)
  }

  return next(req); // 
};