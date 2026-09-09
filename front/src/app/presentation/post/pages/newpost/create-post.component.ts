import { Component, inject, signal, viewChild, ElementRef } from '@angular/core';
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

  readonly contentTextarea = viewChild.required<ElementRef<HTMLTextAreaElement>>('contentTextarea');

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

  // <<============================= Howa (/??\) ===================================>
  wrapSelection(before: string, after: string = before): void {
    const textarea = this.contentTextarea().nativeElement;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const currentValue = textarea.value;

    const selectedText = currentValue.slice(start, end);
    const newValue =
      currentValue.slice(0, start) + before + selectedText + after + currentValue.slice(end);

    this.form.controls.content.setValue(newValue);

    // restore focus and selection after the inserted symbols, so typing continues naturally
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, end + before.length);
    });
  }

  insertAtCursor(text: string): void {
    const textarea = this.contentTextarea().nativeElement;
    const start = textarea.selectionStart;
    const currentValue = textarea.value;

    const newValue = currentValue.slice(0, start) + text + currentValue.slice(start);
    this.form.controls.content.setValue(newValue);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + text.length, start + text.length);
    });
  }

  /// <<<<<<<<<<<<<<<<<<<<<<<<<<<<Media file input >>>>>>>>>>>>>>>>>>>>>>>>>>> \\ 
  triggerImageUpload(): void {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*,video/*'
    input.onchange = () => {
      const file = input.files?.[0];
      if (file) {
        this.uploadAndInsertImage(file);
      }
    };
    input.click();
  }

  insertYoutube(): void {
    const textarea = this.contentTextarea().nativeElement;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const currentValue = textarea.value;

    const selectedText = currentValue.slice(start, end).trim();

    const match = selectedText.match(
      /(?:youtube\.com\/watch\?v=|youtu\.be\/)([A-Za-z0-9_-]{11})/
    );

    if (!match) {
      this.errorMessage.set('Please select a valid YouTube URL.');
      return;
    }

    const videoId = match[1];
    const iframe = `<iframe src="https://www.youtube-nocookie.com/embed/${videoId}" allowfullscreen></iframe>`;
    const newValue =
      currentValue.slice(0, start) +
      iframe +
      currentValue.slice(end);

    this.form.controls.content.setValue(newValue);
    this.errorMessage.set(null);

    setTimeout(() => { 
      textarea.focus();

      const newCursorPosition = start + iframe.length;

      textarea.setSelectionRange(
        newCursorPosition,
        newCursorPosition
      ); 

    });
  } 

  // <<==>> \\
  // <<==>> \\ 
  // <<==>> \\ (<!!>) 
  private uploadAndInsertImage(file: File): void {
    this.createPostUseCase.executeuploadInlineImage(file).subscribe({

      next: (url) => {
        const isVideo = file.type.startsWith('video/');
        const snippet = isVideo
          ? `\n\n<video controls src="${url}"></video>\n\n`
          : `\n\n![${file.name}](${url})\n\n`;
        this.insertAtCursor(snippet); // <<==>> 
      },

      error: (err) => {
        this.errorMessage.set(err.message);
      },

    });
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
    }); // <<==>>> \\
    // <<==>> \\ (<!>)... 
    // <<===>> \\ (<!>) (!!)
  }
}