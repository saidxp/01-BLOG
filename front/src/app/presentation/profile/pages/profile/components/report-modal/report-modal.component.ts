import { Component, inject, input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ReportUserUseCase } from '../../../../../../application/report/use-cases/report-user.use-case';

@Component({
  selector: 'app-report-modal',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './report-modal.component.html',
  styleUrl: './report-modal.component.css',
})

export class ReportModalComponent {

  private readonly reportUserUseCase = inject(ReportUserUseCase);

  readonly username = input.required<string>();

  readonly isOpen = signal(false);
  readonly step = signal<'form' | 'confirm' | 'success'>('form');
  readonly reason = signal('');
  readonly isSubmitting = signal(false);
  readonly errorMessage = signal<string | null>(null);

  open(): void {
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
    this.isSubmitting.set(true);
    this.errorMessage.set(null);

    this.reportUserUseCase.execute(this.username(), this.reason().trim()).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.step.set('success');
      },
      error: (err) => {
        this.isSubmitting.set(false);
        this.errorMessage.set(err.message);
      },
    });
  }
}