import { Component, inject, input, output, signal, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { UpdateProfileUseCase } from '../../../../../../application/profile/use-cases/update-profile.use-case'
import { UserProfile } from '../../../../../../domain/profile/entity/user-profile.entity'

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
    this.isSubmitting.set(true);
    this.errorMessage.set(null);

    const { bio } = this.form.getRawValue();

    this.updateProfileUseCase.execute(bio, this.selectedAvatar).subscribe({
      next: (updatedProfile) => { 
        // <<==>> \\ <!> \\ {<!-!>}
        this.isSubmitting.set(false);
        this.saved.emit(updatedProfile);

      },
      error: (err) => {
        this.isSubmitting.set(false); 
        this.errorMessage.set(err.error?.message || 'Failed to update profile.');
      },
    });
  }

  cancel(): void {
    this.cancelled.emit();
  }
  // <<==>> \\ {<!<->!>} \\ 
}