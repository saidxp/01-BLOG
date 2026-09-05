import { Routes } from '@angular/router';
import { MainLayoutComponent } from './presentation/shared/layouts/main-layout/main-layout.component';
import { AuthLayoutComponent } from './presentation/shared/layouts/auth-layout/auth-layout.component';

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
  },
];