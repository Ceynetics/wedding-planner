CREATE TABLE wedding_files (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    module VARCHAR(100),
    size BIGINT,
    folder VARCHAR(15) NOT NULL,
    s3_key VARCHAR(500) NOT NULL,
    content_type VARCHAR(100),
    workspace_id BIGINT NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    version BIGINT NOT NULL DEFAULT 0
);

CREATE INDEX idx_wedding_files_workspace ON wedding_files(workspace_id);
CREATE INDEX idx_wedding_files_folder ON wedding_files(workspace_id, folder);
