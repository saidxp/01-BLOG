import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { AdminStatsRepository, AdminStats } from '../../../../domain/admin/repository/admin-stats.repository';

@Injectable({ providedIn: 'root' })
export class GetAdminStatsUseCase {
  private readonly adminStatsRepository = inject(AdminStatsRepository);

  execute(): Observable<AdminStats> {
    return this.adminStatsRepository.getStats();
  }
}
