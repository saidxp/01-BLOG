import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AdminStatsRepository, AdminStats } from '../../domain/admin/repository/admin-stats.repository';
import { environment } from '../../../environments/environment.development';

@Injectable()
export class AdminStatsRepositoryImpl extends AdminStatsRepository {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/api/admin/stats`;

  override getStats(): Observable<AdminStats> {
    return this.http.get<AdminStats>(this.baseUrl, { withCredentials: true });
  }
}
