export interface AdminReportDto {
  id: number;
  reporterUsername: string;
  reportedUsername: string;
  reason: string;
  createdAt: string;
}

export interface AdminReportPageDto {
  content: AdminReportDto[];
  totalPages: number;
  number: number;
}