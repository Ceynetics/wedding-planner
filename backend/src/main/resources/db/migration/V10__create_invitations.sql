CREATE TABLE invitations (
    id BIGSERIAL PRIMARY KEY,
    template_id VARCHAR(20),
    name1 VARCHAR(100),
    name2 VARCHAR(100),
    event_date DATE,
    event_time TIME,
    venue VARCHAR(255),
    selected_color VARCHAR(10),
    greeting VARCHAR(200),
    address_line VARCHAR(200),
    is_vip_guest BOOLEAN DEFAULT FALSE,
    pdf_s3_key VARCHAR(500),
    jpeg_s3_key VARCHAR(500),
    status VARCHAR(15) DEFAULT 'DRAFT',
    household_id BIGINT REFERENCES households(id) ON DELETE SET NULL,
    workspace_id BIGINT NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    version BIGINT NOT NULL DEFAULT 0
);

CREATE INDEX idx_invitations_workspace ON invitations(workspace_id);
CREATE INDEX idx_invitations_household ON invitations(household_id);
