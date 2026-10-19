import { DOCUMENT } from '@angular/common';
import { inject, Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly document = inject(DOCUMENT);
  private readonly isDark = signal(false);

  toggle(): void {
    this.isDark.update(value => !value);

    this.document.documentElement.classList.toggle(
      'dark',
      this.isDark()
    );
  }
}