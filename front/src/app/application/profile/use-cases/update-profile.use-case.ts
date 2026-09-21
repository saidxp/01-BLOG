// application/profile/use-cases/update-profile.use-case.ts
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { UserProfileRepository } from '../../../domain/profile/repository/user-profile.repository'
import { UserProfile } from '../../../domain/profile/entity/user-profile.entity'; 
 
@Injectable({ providedIn: 'root' })
export class UpdateProfileUseCase { 

  private readonly userProfileRepository = inject(UserProfileRepository);
    execute(bio: string, avatar: File | null): Observable<UserProfile> {
    return this.userProfileRepository.updateProfile(bio, avatar);
  } // <<==>> \\ {<!!>}
}