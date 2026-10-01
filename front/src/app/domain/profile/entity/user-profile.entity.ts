export class UserProfile {

  constructor(
    public readonly id: number,
    public readonly username: string,
    public readonly bio: string | null,
    public readonly avatarUrl: string | null,
    public readonly createdAt: Date,
    public readonly owner: boolean,
    public readonly subscribed: boolean,
    public readonly postsCount: number,
    public readonly commentsReceivedCount: number
  ) {}
}
