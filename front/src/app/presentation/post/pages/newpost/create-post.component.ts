import { Component, inject, signal, viewChild, ElementRef, OnDestroy } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CreatePostUseCase } from '../../../../application/post/use-cases/create.post.use-case';
import { AuthNavigationService } from '../../../../application/auth/services/auth-navigation.service';
import {ToastService} from '../../../../application/auth/services/toast.service'

@Component({
  selector: 'app-create-post',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './create-post.component.html',
  styleUrl: './create-post.component.css',
})

export class CreatePostComponent implements OnDestroy {

  private readonly fb = inject(FormBuilder);
  private readonly createPostUseCase = inject(CreatePostUseCase);
  private readonly router = inject(Router);
  private readonly authNavigation = inject(AuthNavigationService);
  private readonly toast = inject(ToastService);

  readonly contentTextarea = viewChild.required<ElementRef<HTMLTextAreaElement>>('contentTextarea');
  readonly mediaInput = viewChild<ElementRef<HTMLInputElement>>('mediaInput');

  readonly isSubmitting = signal(false);
  readonly errorMessage = signal<string | null>(null);
  readonly coverError = signal<string | null>(null);
  readonly coverPreviewUrl = signal<string | null>(null);
  selectedFile: File | null = null;

  readonly form = this.fb.nonNullable.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    content: ['', [Validators.required, Validators.minLength(10)]],
  });

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;

    // Cover must be an image (the backend only accepts IMAGE for covers).
    // Invalid pick: show no preview, clear the selection, tell the user why.
    if (file && !file.type.startsWith('image/')) {
      this.coverError.set('Cover image must be an image file (JPG, PNG, WebP, HEIC, AVIF…).');
      this.selectedFile = null;
      this.coverPreviewUrl.set(null);
      input.value = '';
      return;
    }

    this.coverError.set(null);
    this.selectedFile = file;
    this.updateCoverPreview();
  }

  removeCover(): void {
    this.selectedFile = null;
    this.coverError.set(null);
    this.coverPreviewUrl.set(null);
    const ref = this.mediaInput();
    if (ref) ref.nativeElement.value = '';
  }

  private updateCoverPreview(): void {
    const current = this.coverPreviewUrl();
    if (current?.startsWith('blob:')) URL.revokeObjectURL(current);
    this.coverPreviewUrl.set(this.selectedFile ? URL.createObjectURL(this.selectedFile) : null);
  }

  ngOnDestroy(): void {
    const current = this.coverPreviewUrl();
    if (current?.startsWith('blob:')) URL.revokeObjectURL(current);
  }

  // Markdown toolbar helpers
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
        if (err.status === 401) {
          this.authNavigation.handle401(err);
          return;
        }
        this.errorMessage.set(err.error?.message ?? 'Could not upload this media.');
      },

    });
  }

  submit(): void {

    if (this.isSubmitting()) return;

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
        this.toast.success('Post published!');
        this.router.navigateByUrl(`/post/${id}`);
        
      },
      error: (err) => {
        this.isSubmitting.set(false);
        if (err.status === 401) {
          this.authNavigation.handle401(err);
          return;
        }
        const message = err.error?.message ?? 'Could not publish the post.';
        this.errorMessage.set(message);
        this.toast.error(message);
      },
    }); // <<==>>> \\
    // <<==>> \\ (<!>)... 
    // <<===>> \\ (<!>) (!!)
  }
}