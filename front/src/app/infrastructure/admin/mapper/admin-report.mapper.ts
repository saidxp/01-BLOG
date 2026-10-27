// infrastructure/admin/mappers/admin-report.mapper.ts
import { AdminReport } from '../../../domain/admin/entity/admin-report.entity';
import { AdminReportDto } from '../dto/admin-report.dto';

export function toAdminReportEntity(dto: AdminReportDto): AdminReport {
  return new AdminReport(dto.id, dto.reporterUsername, dto.reportedUsername, dto.postId ?? null, dto.reason, new Date(dto.createdAt), dto.status, dto.type);
}