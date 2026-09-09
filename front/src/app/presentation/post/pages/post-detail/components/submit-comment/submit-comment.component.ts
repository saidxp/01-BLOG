import { Component, inject, input, signal , output} from '@angular/core'; // <<==>> \\ (<!!>)
import { FormsModule } from '@angular/forms';
import { AddCommentUseCase } from '../../../../../../application/comments/use-cases/add-comment.use-case';

@Component({
  selector: 'app-submit-comment',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './submit-comment.component.html',
  styleUrl: './submit-comment.component.css',
})
export class SubmitCommentComponent {

  private readonly addCommentUseCase = inject(AddCommentUseCase); // <<==>> \\ 
  
  readonly commentAdded = output<void>();
  readonly postId = input.required<number>();

  readonly content = signal('');
  readonly isSubmitting = signal(false);
  readonly errorMessage = signal<string | null>(null);

  submit(): void {

    const content = this.content().trim();

    if (!content) {
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set(null);

    this.addCommentUseCase.execute(
      this.postId(),
      content
    ).subscribe({
      next: () => {
        this.content.set('');
        console.log("it's gooo ..."); 
        this.commentAdded.emit();
        this.isSubmitting.set(false);
      },

      error: (err) => {
        this.errorMessage.set(err.message);
        this.isSubmitting.set(false);
      },

    });
  }
}