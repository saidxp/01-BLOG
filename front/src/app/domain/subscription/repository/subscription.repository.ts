import { Observable } from 'rxjs';
import { SubscriptionStatus } from '../entity/subscription-status.entity';

export abstract class SubscriptionRepository {
  abstract subscribe(username: string): Observable<SubscriptionStatus>;
  abstract unsubscribe(username: string): Observable<SubscriptionStatus>;
}