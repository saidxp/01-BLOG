import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ReportRepository } from '../../../domain/report/repository/report.repository';

@Injectable({ providedIn: 'root' })
export class ReportUserUseCase {

  private readonly reportRepository = inject(ReportRepository);
  execute(username: string, reason: string): Observable<void> {
    return this.reportRepository.reportUser(username, reason);
  }
  
}