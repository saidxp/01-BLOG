import { Component, inject, input, signal, OnInit } from '@angular/core';
import { ToggleLikeUseCase } from '../../../../../../application/like/use-case/toggle-like.use-case';
import { AuthNavigationService } from '../../../../../../application/auth/services/auth-navigation.service';
import { ToastService } from '../../../../../../application/auth/services/toast.service'

@Component({
  selector: 'app-like-button',
  standalone: true,
  templateUrl: './like-button.component.html',
  styleUrl: './like-button.component.css',
})

export class LikeButtonComponent implements OnInit {
  private readonly toggleLikeUseCase = inject(ToggleLikeUseCase);
  private readonly authNavigation = inject(AuthNavigationService);
  private readonly toast = inject(ToastService);

  readonly postId = input.required<number>();
  readonly initialLiked = input<boolean>(false);
  readonly initialLikeCount = input<number>(0);

  readonly liked = signal(false);
  readonly likeCount = signal(0);
  readonly isSubmitting = signal(false);
  readonly errorMessage = signal<string | null>(null);

  ngOnInit(): void {
    this.liked.set(this.initialLiked());
    this.likeCount.set(this.initialLikeCount());
  }

  
  toggle(): void {
    if (this.isSubmitting()) return;
    if (!this.authNavigation.requireAuthentication()) return;

    this.isSubmitting.set(true);
    this.errorMessage.set(null);
    const wasLiked = this.liked();

    this.toggleLikeUseCase.execute(this.postId(), wasLiked).subscribe({
      next: (status) => {
        this.liked.set(status.liked);
        this.likeCount.set(status.likeCount);
        this.isSubmitting.set(false);
      },
      error: (err) => {
        this.isSubmitting.set(false);
        // apiresponse {}
        if (err.status === 401) {
          this.authNavigation.handle401(err);
          return;
        }
        const message = err.error?.message ?? 'Could not update your like.';
        this.errorMessage.set(message);
        this.toast.error(message);
      },
    });
  }
}
