import { Component, inject, signal, viewChild, ElementRef, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { GetPostByIdUseCase } from '../../../../application/post/use-cases/get-post-by-id.use-case';
import { UpdatePostUseCase } from '../../../../application/post/use-cases/update-post.use-case';
import { AuthNavigationService } from '../../../../application/auth/services/auth-navigation.service';
import { ToastService } from '../../../../application/auth/services/toast.service'

@Component({
  selector: 'app-edit-post',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './edit-post.component.html',
  styleUrl: './edit-post.component.css',
})

export class EditPostComponent implements OnInit { 

  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly getPostByIdUseCase = inject(GetPostByIdUseCase);
  private readonly updatePostUseCase = inject(UpdatePostUseCase);
  private readonly authNavigation = inject(AuthNavigationService);
  private readonly toast = inject(ToastService);

  readonly contentTextarea = viewChild.required<ElementRef<HTMLTextAreaElement>>('contentTextarea');

  readonly isLoading = signal(true);
  readonly isSubmitting = signal(false);
  readonly errorMessage = signal<string | null>(null);
  readonly coverPreviewUrl = signal<string | null>(null);
  readonly coverError = signal<string | null>(null);
  selectedFile: File | null = null;

  private postId!: number;

  readonly form = this.fb.nonNullable.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    content: ['', [Validators.required, Validators.minLength(10)]],
  });

  ngOnInit(): void {
    this.postId = Number(this.route.snapshot.paramMap.get('id'));

    this.getPostByIdUseCase.execute(this.postId).subscribe({
      next: (post) => {
        this.form.patchValue({ title: post.title, content: post.content });
        this.initialMediaUrl = post.mediaUrl ?? null;
        this.coverPreviewUrl.set(this.initialMediaUrl);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.isLoading.set(false);
        if (err.status === 401) {
          this.authNavigation.handle401(err);
          return;
        }
        this.errorMessage.set(err.error?.message ?? (err.status === 404 ? 'Post not found.' : 'Could not load this post.'));
      },
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;

    // Cover must be an image (the backend only accepts IMAGE for covers).
    // Invalid pick: keep the current preview, clear the selection, tell the user why.
    if (file && !file.type.startsWith('image/')) {
      this.coverError.set('Cover image must be an image file (JPG, PNG, WebP, HEIC, AVIF…).');
      this.selectedFile = null;
      input.value = '';
      return;
    }

    this.coverError.set(null);
    this.selectedFile = file;
    const current = this.coverPreviewUrl();
    if (current?.startsWith('blob:')) URL.revokeObjectURL(current);
    this.coverPreviewUrl.set(this.selectedFile ? URL.createObjectURL(this.selectedFile) : this.initialMediaUrl);
  }

  private initialMediaUrl: string | null = null;

  wrapSelection(before: string, after: string = before): void {
    const textarea = this.contentTextarea().nativeElement;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const currentValue = textarea.value;

    const selectedText = currentValue.slice(start, end);
    const newValue =
      currentValue.slice(0, start) + before + selectedText + after + currentValue.slice(end);

    this.form.controls.content.setValue(newValue);

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

  triggerImageUpload(): void {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*,video/*';
    input.onchange = () => {
      const file = input.files?.[0];
      if (file) {
        this.uploadAndInsertImage(file);
      }
    };
    input.click();
  }

  private uploadAndInsertImage(file: File): void {
    this.updatePostUseCase.executeuploadInlineImage(file).subscribe({
      next: (url) => {
        const isVideo = file.type.startsWith('video/');
        const snippet = isVideo
          ? `\n\n<video controls src="${url}"></video>\n\n`
          : `\n\n![${file.name}](${url})\n\n`;
        this.insertAtCursor(snippet);
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


  submit(): void {

    if (this.isSubmitting()) return;

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    } // {<!!>} \\ {<!!>}  \\  
    // <<==>> \\ (!)... 
    this.isSubmitting.set(true);
    this.errorMessage.set(null);
    const { title, content } = this.form.getRawValue();
    this.updatePostUseCase.execute(this.postId, title, content, this.selectedFile).subscribe({
      next: (id) => {
        this.isSubmitting.set(false);
        this.toast.success('Post updated!');
        this.router.navigateByUrl(`/post/${id}`);
      },
      error: (err) => {
        this.isSubmitting.set(false);
        if (err.status === 401) {
          this.authNavigation.handle401(err);
          return;
        }
        const message = err.error?.message ?? 'Could not update the post.';
        this.errorMessage.set(message);
        this.toast.error(message);
      }, // <<==>> \\ (<!<->!>)
    }); // <<===>>> \\) 
  }
}