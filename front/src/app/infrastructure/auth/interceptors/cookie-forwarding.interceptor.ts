import { HttpInterceptorFn } from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';   
import { isPlatformServer } from '@angular/common';
import { SERVER_REQUEST } from '../../ssr/request.token';

export const cookieForwardingInterceptor: HttpInterceptorFn = (req, next) => {

  const platformId = inject(PLATFORM_ID);
  if (isPlatformServer(platformId)) {

    const request = inject(SERVER_REQUEST, { optional: true });

    // Server-side calls go straight to the backend over plain HTTP
    // https://<APP_HOST>:8443/api/me -> http://backend:8080/api/me
    // /api/me                          -> http://backend:8080/api/me
    const backend = 'http://backend:8080';
    const newUrl = req.url.replace(/^(https?:\/\/[^/]+)?(?=\/(api|media)\/)/, backend);
    req = req.clone({ url: newUrl });

    const cookieHeader = request?.headers['cookie'];

    if (cookieHeader) {
      req = req.clone({ setHeaders: { Cookie: cookieHeader } });
    }
  }
  return next(req);
};