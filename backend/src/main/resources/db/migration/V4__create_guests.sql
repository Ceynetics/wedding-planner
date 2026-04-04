CREATE TABLE guests (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    title VARCHAR(10),
    avatar_url VARCHAR(500),
    side VARCHAR(10) NOT NULL,
    status VARCHAR(15) NOT NULL,
    category VARCHAR(15),
    phone VARCHAR(20),
    email VARCHAR(100),
    adults INTEGER DEFAULT 1,
    children INTEGER DEFAULT 0,
    dietary VARCHAR(50),
    is_vip BOOLEAN DEFAULT FALSE,
    is_head_of_household BOOLEAN DEFAULT FALSE,
    notes VARCHAR(500),
    household_id BIGINT REFERENCES households(id) ON DELETE SET NULL,
    workspace_id BIGINT NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    version BIGINT NOT NULL DEFAULT 0
);

CREATE INDEX idx_guests_workspace ON guests(workspace_id);
CREATE INDEX idx_guests_household ON guests(household_id);
CREATE INDEX idx_guests_status ON guests(workspace_id, status);
CREATE INDEX idx_guests_side ON guests(workspace_id, side);

-- Add FK from households.head_guest_id to guests
ALTER TABLE households ADD CONSTRAINT fk_household_head_guest
    FOREIGN KEY (head_guest_id) REFERENCES guests(id) ON DELETE SET NULL;
