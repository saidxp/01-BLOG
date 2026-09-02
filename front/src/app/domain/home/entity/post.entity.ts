export type MediaType = 'IMAGE' | 'VIDEO' | 'NONE';

export class Post {
  constructor(
    public readonly id: number,
    public readonly authorUsername: string,
    public readonly description: string,
    public readonly mediaUrl: string,
    public readonly mediaType: MediaType,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}
}
// <<==>> \\ (!!)
