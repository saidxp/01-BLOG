import { AdminReportRepository } from "../../../../domain/admin/repository/admin-report.repository"; 
import { inject , Injectable} from "@angular/core"; 
import { PagedAdminReports } from "../../../../domain/admin/repository/admin-report.repository"; 
import { Observable } from "rxjs"; 

@Injectable({ providedIn: 'root' })
export class GetAdminReportsUseCase {
  private readonly adminReportRepository = inject(AdminReportRepository);
  execute(page: number = 0): Observable<PagedAdminReports> {
    return this.adminReportRepository.getReports(page);
  }
}