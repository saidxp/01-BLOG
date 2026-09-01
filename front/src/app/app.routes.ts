import { Routes } from '@angular/router';

// Routes .. Im .. Using .. Lazy .. Load .. By Pages (!!)
export const routes: Routes = [
{
    path: 'login',
    loadComponent: () =>
      import('./presentation/auth/pages/login/login.component').then(
        (m) => m.LoginComponent
      ),
},
];
 