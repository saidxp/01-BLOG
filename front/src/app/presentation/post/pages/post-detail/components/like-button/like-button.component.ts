import { Component, inject, input, signal, OnInit } from '@angular/core';
import { ToggleLikeUseCase } from '../../../../../../application/like/use-case/toggle-like.use-case';

@Component({
  selector: 'app-like-button',
  standalone: true,
  templateUrl: './like-button.component.html',
  styleUrl: './like-button.component.css',
})

export class LikeButtonComponent implements OnInit {
  private readonly toggleLikeUseCase = inject(ToggleLikeUseCase);

  readonly postId = input.required<number>();
  readonly initialLiked = input<boolean>(false);
  readonly initialLikeCount = input<number>(0);

  readonly liked = signal(false);
  readonly likeCount = signal(0);
  readonly isSubmitting = signal(false);

  ngOnInit(): void {
    this.liked.set(this.initialLiked());
    this.likeCount.set(this.initialLikeCount());
  }

  toggle(): void {
    if (this.isSubmitting()) return;

    this.isSubmitting.set(true);
    const wasLiked = this.liked();

    this.toggleLikeUseCase.execute(this.postId(), wasLiked).subscribe({
      next: (status) => {
        this.liked.set(status.liked);
        this.likeCount.set(status.likeCount);
        this.isSubmitting.set(false);
      },
      error: () => {
        this.isSubmitting.set(false);
      },
    });
  }
}