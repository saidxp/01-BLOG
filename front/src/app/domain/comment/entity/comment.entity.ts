export class Comment {
  constructor(
    public readonly id: number,
    public readonly authorUsername: string,
    public readonly content: string,
    public readonly createdAt: Date,
    public readonly canDelete : boolean
  ) {}
}