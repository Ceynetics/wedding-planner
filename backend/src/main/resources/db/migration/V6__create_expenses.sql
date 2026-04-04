CREATE TABLE expenses (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    amount DECIMAL(12, 2) NOT NULL,
    category VARCHAR(15),
    paid_by VARCHAR(10),
    is_paid BOOLEAN DEFAULT FALSE,
    split_enabled BOOLEAN DEFAULT FALSE,
    notes VARCHAR(500),
    date DATE,
    workspace_id BIGINT NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    version BIGINT NOT NULL DEFAULT 0
);

CREATE INDEX idx_expenses_workspace ON expenses(workspace_id);
CREATE INDEX idx_expenses_date ON expenses(workspace_id, date);
CREATE INDEX idx_expenses_category ON expenses(workspace_id, category);
