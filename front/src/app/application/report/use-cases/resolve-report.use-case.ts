import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ReportRepository } from '../../../domain/report/repository/report.repository';

@Injectable({ providedIn: 'root' })
export class ResolveReportUserUseCase {

  private readonly reportRepository = inject(ReportRepository);
  execute(id: number): Observable<string> {
    return this.reportRepository.resolveReport(id);
  }
  
}