import { HttpInterceptorFn } from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';   
import { isPlatformServer } from '@angular/common';
import { SERVER_REQUEST } from '../../ssr/request.token';


export const cookieForwardingInterceptor: HttpInterceptorFn = (req, next) => {

  const platformId = inject(PLATFORM_ID);

  if (isPlatformServer(platformId)) {
    const request = inject(SERVER_REQUEST, { optional: true });
    console.log('--- SSR interceptor running ---');
    console.log('SERVER_REQUEST present:', !!request);
    console.log('Cookie header:', request?.headers['cookie']);

    const cookieHeader = request?.headers['cookie'];

    if (cookieHeader) {
      req = req.clone({ setHeaders: { Cookie: cookieHeader } });
      console.log('Cookie forwarded onto outgoing request');
    } else {
      console.log('NO cookie found to forward');
    }
    
  }

  return next(req); // <<==>> \\ 
};