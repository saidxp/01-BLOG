import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { SubscriptionRepository } from '../../domain/subscription/repository/subscription.repository';
import { SubscriptionStatus } from '../../domain/subscription/entity/subscription-status.entity';
import { SubscriptionStatusDto } from './dto/subscription-status.dto';
import { environment } from '../../../environments/environment.development';

@Injectable()
export class SubscriptionRepositoryImpl extends SubscriptionRepository {

  private readonly http = inject(HttpClient);

  private url(username: string): string {
    return `${environment.apiUrl}/api/users/${username}/subscribe`;
  }

  override subscribe(username: string): Observable<SubscriptionStatus> {
    return this.http.post<SubscriptionStatusDto>(this.url(username), {}, { withCredentials: true }).pipe(
      map((dto) => new SubscriptionStatus(dto.subscribed, dto.subscriberCount))
    );
  }
  
  override unsubscribe(username: string): Observable<SubscriptionStatus> {
    return this.http.delete<SubscriptionStatusDto>(this.url(username), { withCredentials: true }).pipe(
      map((dto) => new SubscriptionStatus(dto.subscribed, dto.subscriberCount))
     );
  }

}