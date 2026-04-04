CREATE TABLE hired_vendors (
    id BIGSERIAL PRIMARY KEY,
    vendor_name VARCHAR(100) NOT NULL,
    company_name VARCHAR(100),
    category VARCHAR(15),
    address VARCHAR(255),
    email VARCHAR(100),
    phone VARCHAR(20),
    total_amount DECIMAL(12, 2),
    paid_amount DECIMAL(12, 2) DEFAULT 0,
    notes VARCHAR(500),
    reminder_enabled BOOLEAN DEFAULT FALSE,
    frequency VARCHAR(15),
    due_date DATE,
    vendor_id BIGINT REFERENCES vendors(id) ON DELETE SET NULL,
    workspace_id BIGINT NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    version BIGINT NOT NULL DEFAULT 0
);

CREATE INDEX idx_hired_vendors_workspace ON hired_vendors(workspace_id);
CREATE INDEX idx_hired_vendors_due_date ON hired_vendors(workspace_id, due_date);
