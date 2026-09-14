export class AdminReport {
  constructor(
    public readonly id: number,
    public readonly reporterUsername: string,
    public readonly reportedUsername: string,
    public readonly reason: string,
    public readonly createdAt: Date
  ) {}
}