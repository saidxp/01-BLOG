import { Component, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { GetUserProfileUseCase } from '../../../../application/profile/use-cases/get-user-profile.use-case';
import { UserProfile } from '../../../../domain/profile/entity/user-profile.entity';
import { SubscribeButtonComponent } from './components/subscribe-button/subscribe-button.component';
import { UserPostListComponent } from './components/user-post-list/user-post-list.component';
import {ReportModalComponent} from './components/report-modal/report-modal.component'

@Component({
    selector: 'app-profile',
    standalone: true,
    imports : [CommonModule, SubscribeButtonComponent, UserPostListComponent, ReportModalComponent],
    templateUrl: './profile.component.html',
    styleUrl: './profile.component.css',
})

export class ProfileComponent implements OnInit {

    private readonly route = inject(ActivatedRoute);
    private readonly getUserProfileUseCase = inject(GetUserProfileUseCase);

    readonly profile = signal<UserProfile | null>(null);
    readonly isLoading = signal(true);
    readonly errorMessage = signal<string | null>(null);

    ngOnInit(): void { 
        const username = this.route.snapshot.paramMap.get('username')!;
        this.getUserProfileUseCase.execute(username).subscribe({
            next: (profile) => {
                this.profile.set(profile);
                this.isLoading.set(false); 
                console.log("State Of Profile ", profile);
            },
            error: (err) => {
                this.errorMessage.set(err.message);
                this.isLoading.set(false);
            },
        });
    }
}