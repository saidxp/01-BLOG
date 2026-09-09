import { APP_INITIALIZER, ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideClientHydration } from '@angular/platform-browser';
import { provideHttpClient, withFetch ,withInterceptors } from '@angular/common/http';
import { GetCurrentUserUseCase } from './application/auth/use-cases/get-current-user.use-case';
import { firstValueFrom } from 'rxjs';
import { routes } from './app.routes';
import { AuthRepository } from './domain/auth/repositories/auth.repository';
import { AuthRepositoryImpl } from './infrastructure/auth/auth-repository.impl';
import { PostRepository } from './domain/post/repositories/post.repository';
import { PostRepositoryImpl } from './infrastructure/post/post-repository.impl';
import { cookieForwardingInterceptor } from './infrastructure/auth/interceptors/cookie-forwarding.interceptor';
import { PostWriteRepository } from './domain/post/repositories/post-write.repository'; 
import { PostWriteRepositoryImpl } from './infrastructure/post/post-write-repository.impl';
import { PostReadRepository } from './domain/post/repositories/post-read.repository';
import { PostReadRepositoryImpl } from './infrastructure/post/post-read-repository.impl';
import { PostUpdateRepositoryImpl } from './infrastructure/post/post-update-repository.impl';
import { PostUpdateRepository } from './domain/post/repositories/post-update.repository';
import {CommentRepository} from './domain/comment/repository/comment.repository'
import { CommentRepositoryImpl } from './infrastructure/commnet/comment.repository.impl'; 
import { CommentReadRepository } from './domain/comment/repository/comment-read.repository';
import { CommentReadRepositoryImpl } from './infrastructure/commnet/comment-read-repository.impl';
import { LikeRepository } from './domain/like/repository/like.repository';
import {LikeRepositoryImpl} from './infrastructure/like/like-repository.impl';

export const appConfig: ApplicationConfig = {
  // <<>> \\ (<!>)
  providers: [
    provideRouter(routes),
    provideClientHydration(), // 
    provideHttpClient(withFetch(), withInterceptors([cookieForwardingInterceptor])),
    { provide: AuthRepository, useClass: AuthRepositoryImpl },
    { provide: PostRepository, useClass: PostRepositoryImpl }, 
    { provide: PostWriteRepository, useClass: PostWriteRepositoryImpl },
    { provide: PostReadRepository, useClass: PostReadRepositoryImpl },
    { provide: PostUpdateRepository, useClass: PostUpdateRepositoryImpl},
    { provide: CommentRepository, useClass: CommentRepositoryImpl},
    { provide: CommentReadRepository, useClass: CommentReadRepositoryImpl},
    { provide: LikeRepository, useClass:LikeRepositoryImpl}, 
    {
      provide: APP_INITIALIZER,
      useFactory: (useCase: GetCurrentUserUseCase) => () =>
        firstValueFrom(useCase.execute()),
      deps: [GetCurrentUserUseCase],
      multi: true,
    },
  ], // <<==>> \\ 
};