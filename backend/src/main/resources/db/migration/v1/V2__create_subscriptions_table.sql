CREATE TABLE subscriptions (
    id BIGSERIAL PRIMARY KEY,

    subscriber_id BIGINT NOT NULL,
    subscribed_to_id BIGINT NOT NULL,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_subscriber
        FOREIGN KEY (subscriber_id) REFERENCES users(id) ON DELETE CASCADE,

    CONSTRAINT fk_subscribed_to
        FOREIGN KEY (subscribed_to_id) REFERENCES users(id) ON DELETE CASCADE,

    CONSTRAINT uq_subscription UNIQUE (subscriber_id, subscribed_to_id)
);