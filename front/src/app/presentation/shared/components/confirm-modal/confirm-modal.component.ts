import { Component, effect, ElementRef, HostListener, input, output, viewChild } from '@angular/core';

@Component({
  selector: 'app-confirm-modal',
  standalone: true,
  templateUrl: './confirm-modal.component.html',
  styleUrl: './confirm-modal.component.css',
})

export class ConfirmModalComponent { 

  readonly isOpen = input.required<boolean>();
  readonly title = input<string>('Are you sure?');
  readonly message = input<string>('This action cannot be undone.');

  readonly confirmed = output<void>();
  readonly cancelled = output<void>();
  readonly dialog = viewChild<ElementRef<HTMLElement>>('dialog');

  private previouslyFocused: HTMLElement | null = null;

  private readonly focusEffect = effect(() => {
    const isOpen = this.isOpen();
    const dialog = this.dialog();

    if (typeof document === 'undefined') return;

    if (isOpen && dialog) {
      this.previouslyFocused = document.activeElement as HTMLElement | null;
      queueMicrotask(() => dialog.nativeElement.querySelector<HTMLElement>('button')?.focus());
    } else if (!isOpen && this.previouslyFocused) {
      this.previouslyFocused.focus();
      this.previouslyFocused = null;
    }
  });

  @HostListener('document:keydown.escape')
  cancelOnEscape(): void {
    if (this.isOpen()) {
      this.cancel();
    }
  }

  cancel(): void {
    this.cancelled.emit();
  }

  onDialogKeydown(event: KeyboardEvent): void {
    if (event.key !== 'Tab') return;

    const dialog = event.currentTarget as HTMLElement;
    const controls = Array.from(dialog.querySelectorAll<HTMLElement>('button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])'));
    const first = controls[0];
    const last = controls.at(-1);

    if (!first || !last) return;

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }
}
