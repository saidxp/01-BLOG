import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CreatePostUseCase } from '../../../../application/post/use-cases/create.post.use-case';

@Component({
  selector: 'app-create-post',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './create-post.component.html',
  styleUrl: './create-post.component.css',
})
export class CreatePostComponent {
  private readonly fb = inject(FormBuilder);
  private readonly createPostUseCase = inject(CreatePostUseCase);
  private readonly router = inject(Router);

  readonly isSubmitting = signal(false);
  readonly errorMessage = signal<string | null>(null);
  selectedFile: File | null = null;

  readonly form = this.fb.nonNullable.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    content: ['', [Validators.required, Validators.minLength(10)]],
  });

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.selectedFile = input.files?.[0] ?? null;
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set(null);

    const { title, content } = this.form.getRawValue();

    this.createPostUseCase.execute(title, content, this.selectedFile).subscribe({
      next: (id) => {
        this.isSubmitting.set(false);
        this.router.navigateByUrl(`/post/${id}`);
      },
      error: (err) => {
        this.isSubmitting.set(false);
        this.errorMessage.set(err.message);
      },
    });
  }
}