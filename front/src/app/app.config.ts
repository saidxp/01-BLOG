import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideClientHydration } from '@angular/platform-browser';
import { provideHttpClient, withFetch } from '@angular/common/http';

import { routes } from './app.routes';
import { AuthRepository } from './domain/auth/repositories/auth.repository';
import { AuthRepositoryImpl } from './infrastructure/auth/auth-repository.impl';
import { PostRepository } from './domain/home/repository/post.repository';
import { PostRepositoryImpl } from './infrastructure/home/post-repository.impl';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideClientHydration(),
    provideHttpClient(withFetch()),
    { provide: AuthRepository, useClass: AuthRepositoryImpl },
    { provide: PostRepository, useClass: PostRepositoryImpl }
  ],
};