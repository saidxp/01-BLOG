import { Routes } from '@angular/router';

// Routes .. Im .. Using .. Lazy .. Load .. By Pages (!!) /...\ (!!) \\ (<!<->!>)
export const routes: Routes = [
    {
        path: 'login',
        loadComponent: () =>
            import('./presentation/auth/pages/login/login.component').then(
                (m) => m.LoginComponent
            ),
    },
    {
        path: 'register',
        loadComponent: () =>
            import('./presentation/auth/pages/register/register.component').then(
                (m) => m.RegisterComponent
            ),
    },
    {
        path: '',
        loadComponent: () =>
            import('./presentation/home/pages/home/home.component').then((m) => m.HomeComponent),
    },

];
