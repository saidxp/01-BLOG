export class Notification {
  constructor(
    public readonly id: number,
    public readonly message: string,
    public readonly postId: number,
    public readonly authorUsername: string,
    public readonly authorAvatarUrl: string | null,
    public readonly read: boolean,
    public readonly createdAt: Date
  ) {}
}