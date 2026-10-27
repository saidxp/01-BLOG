import { Component, inject, input, output, signal, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { UpdateProfileUseCase } from '../../../../../../application/profile/use-cases/update-profile.use-case'
import { UserProfile } from '../../../../../../domain/profile/entity/user-profile.entity'
import { AuthNavigationService } from '../../../../../../application/auth/services/auth-navigation.service';

import { ToastService } from '../../../../../../application/auth/services/toast.service'

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './edit-profile.component.html',
  styleUrl: './edit-profile.component.css',
})

export class EditProfileComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly updateProfileUseCase = inject(UpdateProfileUseCase);
  private readonly authNavigation = inject(AuthNavigationService);
  private readonly toast = inject(ToastService);

  readonly profile = input.required<UserProfile>();
  readonly saved = output<UserProfile>();
  readonly cancelled = output<void>();

  readonly isSubmitting = signal(false);
  readonly errorMessage = signal<string | null>(null);
  selectedAvatar: File | null = null;

  readonly form = this.fb.nonNullable.group({
    bio: [''],
  });

  ngOnInit(): void {
    this.form.patchValue({ bio: this.profile().bio ?? '' });
  }

  onAvatarSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.selectedAvatar = input.files?.[0] ?? null;
  }
  
  submit(): void {
    if (this.isSubmitting()) return;
    this.isSubmitting.set(true);
    this.errorMessage.set(null);

    const { bio } = this.form.getRawValue();

    this.updateProfileUseCase.execute(bio, this.selectedAvatar).subscribe({
      next: (updatedProfile) => { 
        // <<==>> \\ <!> \\ {<!-!>}
        this.isSubmitting.set(false);
        this.saved.emit(updatedProfile);
        this.toast.success('Profile updated.');

      },
      error: (err) => {
        this.isSubmitting.set(false);
        if (err.status === 401) {
          this.authNavigation.handle401(err);
          return;
        }
        const message = err.error?.message ?? 'Failed to update profile.';
        this.errorMessage.set(message);
        this.toast.error(message);
      },
    });
  }

  cancel(): void {
    this.cancelled.emit();
  }
  // <<==>> \\ {<!<->!>} \\ 
}