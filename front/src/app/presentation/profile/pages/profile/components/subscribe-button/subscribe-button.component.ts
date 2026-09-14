import { Component, inject, input, signal, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToggleSubscriptionUseCase } from '../../../../../../application/subscription/use-cases/toggle-subscription.use-case'

@Component({
  selector: 'app-subscribe-button',
  standalone: true,
  templateUrl: './subscribe-button.component.html',
  styleUrl: './subscribe-button.component.css',
})

export class SubscribeButtonComponent implements OnInit { 
  private readonly toggleSubscriptionUseCase = inject(ToggleSubscriptionUseCase);
  private readonly router = inject(Router);

  readonly username = input.required<string>();
  readonly initialSubscribed = input<boolean>(false);

  readonly subscribed = signal(false);
  readonly isSubmitting = signal(false);

  ngOnInit(): void {
    this.subscribed.set(this.initialSubscribed());
  }

  toggle(): void {
    if (this.isSubmitting()) return;

    this.isSubmitting.set(true);
    const wasSubscribed = this.subscribed();

    this.toggleSubscriptionUseCase.execute(this.username(), wasSubscribed).subscribe({
      next: (status) => {
        this.subscribed.set(status.subscribed);
        this.isSubmitting.set(false);
      },
      error: (err: any) => {
        this.isSubmitting.set(false);
        if (err.status === 401) { 
          // this.router.navigateByUrl('/login'); 
          console.log("I Will Handle Global Exeption Later To Handle Error Message ")
        }
      },
    }); // <<==>> \\ (<!!>) 
  }
}