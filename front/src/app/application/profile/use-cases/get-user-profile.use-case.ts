import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { UserProfileRepository } from '../../../domain/profile/repository/user-profile.repository';
import { UserProfile } from '../../../domain/profile/entity/user-profile.entity';

@Injectable({ providedIn: 'root' })
export class GetUserProfileUseCase {

  private readonly userProfileRepository = inject(UserProfileRepository);
  execute(username: string): Observable<UserProfile> {
    return this.userProfileRepository.getProfile(username);
  }
}