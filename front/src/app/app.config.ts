import { APP_INITIALIZER, ApplicationConfig } from '@angular/core'; 
import { provideRouter } from '@angular/router';
import { provideClientHydration } from '@angular/platform-browser';
import { provideHttpClient, withFetch ,withInterceptors } from '@angular/common/http';
import { GetCurrentUserUseCase } from './application/auth/use-cases/get-current-user.use-case';
import { catchError, firstValueFrom, of, throwError } from 'rxjs';
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
import { CommentRepository} from './domain/comment/repository/comment.repository'
import { CommentRepositoryImpl } from './infrastructure/commnet/comment.repository.impl'; 
import { CommentReadRepository } from './domain/comment/repository/comment-read.repository';
import { CommentReadRepositoryImpl } from './infrastructure/commnet/comment-read-repository.impl';
import { LikeRepository } from './domain/like/repository/like.repository';
import { LikeRepositoryImpl} from './infrastructure/like/like-repository.impl'; 
import { UserProfileRepository } from './domain/profile/repository/user-profile.repository';
import { UserProfileRepositoryImpl } from './infrastructure/profile/user-profile-repository.impl';
import { SubscriptionRepository } from './domain/subscription/repository/subscription.repository'; 
import { SubscriptionRepositoryImpl } from './infrastructure/subscription/subscription-repository.impl';
import { ReportRepository } from './domain/report/repository/report.repository'; 
import { ReportRepositoryImpl } from './infrastructure/report/report-repository.impl';
import { NotificationRepository } from './domain/notification/repository/notification.repository';
import { NotificationRepositoryImpl } from './infrastructure/notification/notification-repository.impl';
import { AdminUserRepository } from './domain/admin/repository/admin-user.repository'; 
import { AdminUserRepositoryImpl } from './infrastructure/admin/admin-user-repository.impl';
import { AdminPostRepository } from './domain/admin/repository/admin-post.repository';
import { AdminPostRepositoryImpl } from './infrastructure/admin/admin-post-repository.impl';
import { AdminReportRepository } from './domain/admin/repository/admin-report.repository';
import { AdminReportRepositoryImpl } from './infrastructure/admin/admin-report-repository.impl';
import { AdminStatsRepository } from './domain/admin/repository/admin-stats.repository';
import { AdminStatsRepositoryImpl } from './infrastructure/admin/admin-stats-repository.impl';
import { errorInterceptor } from './infrastructure/auth/interceptors/error.interceptor';

export const appConfig: ApplicationConfig = {
  // <<>> \\ (<!>)
  providers: [
    provideRouter(routes),
    provideClientHydration(), // 
    provideHttpClient(withFetch(), withInterceptors([cookieForwardingInterceptor, errorInterceptor])),
    { provide: AuthRepository, useClass: AuthRepositoryImpl},
    { provide: PostRepository, useClass: PostRepositoryImpl}, 
    { provide: PostWriteRepository, useClass: PostWriteRepositoryImpl},
    { provide: PostReadRepository, useClass: PostReadRepositoryImpl},
    { provide: PostUpdateRepository, useClass: PostUpdateRepositoryImpl},
    { provide: CommentRepository, useClass: CommentRepositoryImpl},
    { provide: CommentReadRepository, useClass: CommentReadRepositoryImpl},
    { provide: LikeRepository, useClass:LikeRepositoryImpl},
    { provide: UserProfileRepository, useClass:UserProfileRepositoryImpl},
    { provide: SubscriptionRepository, useClass : SubscriptionRepositoryImpl},
    { provide: ReportRepository, useClass: ReportRepositoryImpl},
    { provide: NotificationRepository, useClass: NotificationRepositoryImpl},
    { provide: AdminUserRepository, useClass: AdminUserRepositoryImpl},
    { provide: AdminPostRepository, useClass: AdminPostRepositoryImpl},
    { provide: AdminReportRepository, useClass: AdminReportRepositoryImpl },
    { provide: AdminStatsRepository, useClass: AdminStatsRepositoryImpl },
    {
      provide: APP_INITIALIZER,
      useFactory: (useCase: GetCurrentUserUseCase) => () =>
        firstValueFrom(useCase.execute().pipe(
          catchError((err) => err.status === 401 ? of(null) : throwError(() => err))
        )),
      deps: [GetCurrentUserUseCase],
      multi: true,
    },
  ], // <<==>> \\ (<!!>) 
};