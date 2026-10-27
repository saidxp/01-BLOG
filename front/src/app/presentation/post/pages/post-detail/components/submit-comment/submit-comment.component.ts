import { Component, inject, input, signal , output} from '@angular/core'; // <<==>> \\ (<!!>)
import { FormsModule } from '@angular/forms';
import { AddCommentUseCase } from '../../../../../../application/comments/use-cases/add-comment.use-case';
import { Comment } from '../../../../../../domain/comment/entity/comment.entity';
import { AuthNavigationService } from '../../../../../../application/auth/services/auth-navigation.service';

import { ToastService } from '../../../../../../application/auth/services/toast.service'

@Component({
  selector: 'app-submit-comment',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './submit-comment.component.html',
  styleUrl: './submit-comment.component.css',
})

export class SubmitCommentComponent {

  private readonly addCommentUseCase = inject(AddCommentUseCase); // <<==>> \\
  private readonly authNavigation = inject(AuthNavigationService);
  private readonly toast = inject(ToastService);

  readonly commentAdded = output<Comment>();
  readonly postId = input.required<number>();

  readonly content = signal('');
  readonly isSubmitting = signal(false);
  readonly errorMessage = signal<string | null>(null);

  submit(): void {

    if (this.isSubmitting()) return;

    const content = this.content().trim();

    if (!content) {
      return;
    }

    if (!this.authNavigation.requireAuthentication()) return;

    this.isSubmitting.set(true);
    this.errorMessage.set(null);

    this.addCommentUseCase.execute(
      this.postId(),
      content
    ).subscribe({
      next: (comment) => {
        this.content.set('');
        console.log("it's gooo ..."); 
        this.commentAdded.emit(comment);
        this.isSubmitting.set(false);
      },

      error: (err) => {
        this.isSubmitting.set(false);
        if (err.status === 401) {
          this.authNavigation.handle401(err);
          return;
        }
        const message = err.error?.message ?? 'Could not submit your comment.';
        this.errorMessage.set(message);
        this.toast.error(message);
      },

    });
  }
}
