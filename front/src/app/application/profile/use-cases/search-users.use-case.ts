import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { UserProfileRepository } from '../../../domain/profile/repository/user-profile.repository';
import { UserSearchResult } from '../../../domain/profile/entity/user-search-result.entity';

@Injectable({ providedIn: 'root' })
export class SearchUsersUseCase {
  private readonly userProfileRepository = inject(UserProfileRepository);

  execute(query: string): Observable<UserSearchResult[]> {
    return this.userProfileRepository.searchUsers(query);
  } 
  
}