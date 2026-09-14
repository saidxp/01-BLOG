export class SubscriptionStatus {
  constructor(
    public readonly subscribed: boolean,
    public readonly subscriberCount: number
  ) {}
}
