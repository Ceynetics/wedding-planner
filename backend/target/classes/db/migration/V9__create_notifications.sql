CREATE TABLE notifications (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description VARCHAR(500),
    type VARCHAR(15) NOT NULL,
    priority VARCHAR(10) NOT NULL,
    action_url VARCHAR(500),
    image_url VARCHAR(500),
    is_read BOOLEAN DEFAULT FALSE,
    is_push_sent BOOLEAN DEFAULT FALSE,
    scheduled_at TIMESTAMP,
    sent_at TIMESTAMP,
    workspace_id BIGINT NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    version BIGINT NOT NULL DEFAULT 0
);

CREATE INDEX idx_notifications_workspace_user ON notifications(workspace_id, user_id);
CREATE INDEX idx_notifications_unread ON notifications(workspace_id, user_id, is_read);
CREATE INDEX idx_notifications_type ON notifications(workspace_id, type);
CREATE INDEX idx_notifications_created ON notifications(created_at DESC);
