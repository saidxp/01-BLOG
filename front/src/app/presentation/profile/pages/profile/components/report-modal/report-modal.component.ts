import { Component, computed, inject, input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ReportUserUseCase } from '../../../../../../application/report/use-cases/report-user.use-case';
import { AuthNavigationService } from '../../../../../../application/auth/services/auth-navigation.service';

import { ToastService } from '../../../../../../application/auth/services/toast.service'

@Component({
  selector: 'app-report-modal',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './report-modal.component.html',
  styleUrl: './report-modal.component.css',
})

export class ReportModalComponent {

  private readonly reportUserUseCase = inject(ReportUserUseCase);
  private readonly authNavigation = inject(AuthNavigationService);
  private readonly toast = inject(ToastService);

  readonly username = input.required<string>();
  readonly postId = input<number | undefined>(undefined);

  readonly isPostReport = computed(() => this.postId() != null);

  readonly isOpen = signal(false);
  readonly step = signal<'form' | 'confirm' | 'success'>('form');
  readonly reason = signal('');
  readonly isSubmitting = signal(false);
  readonly errorMessage = signal<string | null>(null);
  
  open(): void {
    if (!this.authNavigation.requireAuthentication()) return;

    this.isOpen.set(true);
    this.step.set('form');
    this.reason.set('');
    this.errorMessage.set(null);
  }

  close(): void {
    this.isOpen.set(false);
  }

  goToConfirm(): void {
    if (!this.reason().trim()) return;
    this.step.set('confirm');
  }

  goBackToForm(): void {
    this.step.set('form');
  }

  confirmSubmit(): void {
    if (this.isSubmitting()) return;
    this.isSubmitting.set(true);
    this.errorMessage.set(null);

    this.reportUserUseCase.execute(this.username(), this.reason().trim(), this.postId()).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.step.set('success');
        this.toast.success(this.isPostReport()
          ? 'Post reported. Thank you!'
          : 'User reported. Thank you!');
      },
      error: (err) => {
        this.isSubmitting.set(false);
        if (err.status === 401) {
          this.authNavigation.handle401(err);
          return;
        }
        const message = err.error?.message ?? 'Could not submit this report.';
        this.errorMessage.set(message);
        this.toast.error(message);
      },
    });
  }
}