export class AdminPost {
  constructor(
    public readonly id: number,
    public readonly title: string,
    public readonly authorUsername: string,
    public readonly createdAt: Date
  ) {}
}