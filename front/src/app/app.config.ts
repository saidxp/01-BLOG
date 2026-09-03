import { APP_INITIALIZER, ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideClientHydration } from '@angular/platform-browser';
import { provideHttpClient, withFetch ,withInterceptors } from '@angular/common/http';
import { GetCurrentUserUseCase } from './application/auth/use-cases/get-current-user.use-case';
import { firstValueFrom } from 'rxjs';
import { routes } from './app.routes';
import { AuthRepository } from './domain/auth/repositories/auth.repository';
import { AuthRepositoryImpl } from './infrastructure/auth/auth-repository.impl';
import { PostRepository } from './domain/home/repository/post.repository';
import { PostRepositoryImpl } from './infrastructure/home/post-repository.impl';
import { cookieForwardingInterceptor } from './infrastructure/auth/interceptors/cookie-forwarding.interceptor';

export const appConfig: ApplicationConfig = {
  // <<>> \\ (<!>)
  providers: [
    provideRouter(routes),
    provideClientHydration(),
    provideHttpClient(withFetch(), withInterceptors([cookieForwardingInterceptor])),
    { provide: AuthRepository, useClass: AuthRepositoryImpl },
    { provide: PostRepository, useClass: PostRepositoryImpl },
    {
      provide: APP_INITIALIZER,
      useFactory: (useCase: GetCurrentUserUseCase) => () =>
        firstValueFrom(useCase.execute()),
      deps: [GetCurrentUserUseCase],
      multi: true,
    },
  ], // <<==>> \\ 
};