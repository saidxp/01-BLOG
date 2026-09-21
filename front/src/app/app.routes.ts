import { Routes } from '@angular/router';
import { MainLayoutComponent } from './presentation/shared/layouts/main-layout/main-layout.component';
import { AuthLayoutComponent } from './presentation/shared/layouts/auth-layout/auth-layout.component';
import { AdminLayoutComponent } from './presentation/shared/layouts/admin-layout/admin-layout.component';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./presentation/home/pages/home/home.component').then((m) => m.HomeComponent),
      },
      {
        path: 'new',
        loadComponent: () =>
          import('./presentation/post/pages/newpost/create-post.component').then((m) => m.CreatePostComponent),
      },
      {
        path: 'post/:id',
        loadComponent: () =>
          import('./presentation/post/pages/post-detail/post-detail.component').then((m) => m.PostDetailComponent),
      },
      {
        path: 'post/:id/edit',
        loadComponent: () =>
          import('./presentation/post/pages/edit-post/edit-post.component').then((m) => m.EditPostComponent),
      },
      {
        path: 'profile/:username',
        loadComponent: () =>
          import('./presentation/profile/pages/profile/profile.component').then((m) => m.ProfileComponent),
      },
      {
        path: 'notifications',
        loadComponent: () =>
          import('./presentation/notifications/pages/notifications/notifications.component').then((howa) => howa.NotificationsComponent)

      },
    ],
  },

  {
    path: 'admin',
    component: AdminLayoutComponent,
    children: [
      {
        path: 'users',
        loadComponent: () =>
          import('./presentation/admin/pages/admin-users/admin-users.component').then((m) => m.AdminUsersComponent),
      },
      {
        path: 'posts',
        loadComponent: () =>
          import('./presentation/admin/pages/admin-posts/admin-posts.component').then((m) => m.AdminPostsComponent),
      },
      {
        path: 'reports',
        loadComponent: () =>
          import('./presentation/admin/pages/admin-reports/admin-reports.component').then((m) => m.AdminReportsComponent),
      }
    ],
  },
  
  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      {
        path: 'login',
        loadComponent: () =>
          import('./presentation/auth/pages/login/login.component').then((m) => m.LoginComponent),
      },
      {
        path: 'register',
        loadComponent: () =>
          import('./presentation/auth/pages/register/register.component').then((m) => m.RegisterComponent),
      },
    ],
  },  // <<==>> \\ {(<|<->|>)} 
]; 
