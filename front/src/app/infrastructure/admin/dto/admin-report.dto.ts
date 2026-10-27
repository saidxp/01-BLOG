export type ReportStatus = 'PENDING' | 'RESOLVED';
export type ReportType = 'POST' | 'USER';

export interface AdminReportDto { 
  id: number;
  reporterUsername: string;
  reportedUsername: string;
  postId : number | null;
  reason: string;
  createdAt: string;
  status: ReportStatus;
  type: ReportType;
}

export interface AdminReportPageDto {
  content: AdminReportDto[];
  totalPages: number;
  number: number;
}