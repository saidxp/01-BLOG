import { Component, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { GetUserProfileUseCase } from '../../../../application/profile/use-cases/get-user-profile.use-case';
import { UserProfile } from '../../../../domain/profile/entity/user-profile.entity';
import { SubscribeButtonComponent } from './components/subscribe-button/subscribe-button.component';
import { UserPostListComponent } from './components/user-post-list/user-post-list.component';
import { ReportModalComponent } from './components/report-modal/report-modal.component'
import { EditProfileComponent } from './components/edit-profile/edit-profile.component';

@Component({
    selector: 'app-profile',
    standalone: true,
    imports: [CommonModule, SubscribeButtonComponent, UserPostListComponent, ReportModalComponent, EditProfileComponent],
    templateUrl: './profile.component.html',
    styleUrl: './profile.component.css',
})

export class ProfileComponent implements OnInit {

    private readonly route = inject(ActivatedRoute);
    private readonly getUserProfileUseCase = inject(GetUserProfileUseCase);

    readonly profile = signal<UserProfile | null>(null);
    readonly isLoading = signal(true);
    readonly errorMessage = signal<string | null>(null);
    readonly isEditing = signal(false);

    ngOnInit(): void {
        const username = this.route.snapshot.paramMap.get('username')!;
        this.getUserProfileUseCase.execute(username).subscribe({
            next: (profile) => {
                this.profile.set(profile);
                this.isLoading.set(false);
                console.log("State Of Profile ", profile);
            },
            error: (err) => {
                this.isLoading.set(false);
                this.errorMessage.set(err.error?.message ?? (err.status === 404 ? 'User not found.' : 'Could not load this profile.'));
            },
        });
    }
    
    onProfileSaved(updatedProfile: UserProfile): void {
        this.profile.set(updatedProfile);
        this.isEditing.set(false);
    } 

}