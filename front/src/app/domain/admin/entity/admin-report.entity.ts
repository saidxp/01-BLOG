export type ReportStatus = 'PENDING' | 'RESOLVED';
export type ReportType = 'POST' | 'USER';

export class AdminReport { 

  constructor(
    public readonly id: number,
    public readonly reporterUsername: string,
    public readonly reportedUsername: string,
    public readonly postId: number | null = null,
    public readonly reason: string,
    public readonly createdAt: Date,
    public readonly status: ReportStatus,
    public readonly type : ReportType
  ) {} // {} \\ {->}
} 