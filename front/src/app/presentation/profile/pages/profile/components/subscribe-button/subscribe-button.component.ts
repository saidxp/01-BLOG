import { Component, inject, input, signal, OnInit } from '@angular/core';
import { ToggleSubscriptionUseCase } from '../../../../../../application/subscription/use-cases/toggle-subscription.use-case'
import { AuthNavigationService } from '../../../../../../application/auth/services/auth-navigation.service';

import { ToastService } from '../../../../../../application/auth/services/toast.service'

@Component({
  selector: 'app-subscribe-button',
  standalone: true,
  templateUrl: './subscribe-button.component.html',
  styleUrl: './subscribe-button.component.css',
})

export class SubscribeButtonComponent implements OnInit { 
  private readonly toggleSubscriptionUseCase = inject(ToggleSubscriptionUseCase);
  private readonly authNavigation = inject(AuthNavigationService);
  private readonly toast = inject(ToastService);

  readonly username = input.required<string>();
  readonly initialSubscribed = input<boolean>(false);

  readonly subscribed = signal(false);
  readonly isSubmitting = signal(false);

  ngOnInit(): void {
    this.subscribed.set(this.initialSubscribed());
  }

  toggle(): void {
    if (this.isSubmitting()) return;
    if (!this.authNavigation.requireAuthentication()) return;

    this.isSubmitting.set(true);
    const wasSubscribed = this.subscribed();

    this.toggleSubscriptionUseCase.execute(this.username(), wasSubscribed).subscribe({
      next: (status) => {
        this.subscribed.set(status.subscribed);
        this.isSubmitting.set(false);
        this.toast.success(status.subscribed
          ? `You subscribed to ${this.username()}`
          : `You unsubscribed from ${this.username()}`);
      },
      error: (err) => {
        this.isSubmitting.set(false);
        if (err.status === 401) {
          this.authNavigation.handle401(err);
          return;
        }
        this.toast.error(err.error?.message ?? 'Could not subscribe. Try again.');
      },
    }); // <<==>> \\ (<!!>) 
  }
}
