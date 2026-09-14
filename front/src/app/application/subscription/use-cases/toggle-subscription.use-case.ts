import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { SubscriptionRepository } from '../../../domain/subscription/repository/subscription.repository'
import { SubscriptionStatus } from '../../../domain/subscription/entity/subscription-status.entity';

@Injectable({ providedIn: 'root' })
export class ToggleSubscriptionUseCase {
    
  private readonly subscriptionRepository = inject(SubscriptionRepository);

  execute(username: string, currentlySubscribed: boolean): Observable<SubscriptionStatus> {
    return currentlySubscribed
      ? this.subscriptionRepository.unsubscribe(username)
      : this.subscriptionRepository.subscribe(username);
  }

}