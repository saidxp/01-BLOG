import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { LoginUseCase } from '../../../../application/auth/use-cases/login.use-case';
import { AuthNavigationService } from '../../../../application/auth/services/auth-navigation.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})

export class LoginComponent {

  private readonly fb = inject(FormBuilder);
  private readonly loginUseCase = inject(LoginUseCase);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly authNavigation = inject(AuthNavigationService);

  readonly isLoading = signal(false);
  readonly errorMessage = signal<string | null>(null);

  readonly form = this.fb.nonNullable.group({
    identifier: ['', [Validators.required, Validators.pattern(/\S/)]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });
  
  submit(): void {
    if (this.isLoading()) return;
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    const { identifier, password } = this.form.getRawValue();

    this.loginUseCase.execute(identifier.trim(), password).subscribe({
      next: () => {
        this.isLoading.set(false);
        const returnUrl = this.authNavigation.safeReturnUrl(
          this.route.snapshot.queryParamMap.get('returnUrl')
        );
        void this.router.navigateByUrl(returnUrl);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMessage.set(err.status === 401
          ? 'Invalid email or password.'
          : err.error?.message ?? 'Unable to sign in.');
      },
    });
  }
}
