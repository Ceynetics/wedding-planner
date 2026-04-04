-- Seating tables (minimal stub, fully populated in V9)
CREATE TABLE seating_tables (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    table_shape VARCHAR(15),
    chair_count INTEGER,
    position_x DOUBLE PRECISION,
    position_y DOUBLE PRECISION,
    rotation DOUBLE PRECISION,
    is_vip BOOLEAN DEFAULT FALSE,
    workspace_id BIGINT NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    version BIGINT NOT NULL DEFAULT 0
);

CREATE INDEX idx_seating_tables_workspace ON seating_tables(workspace_id);

-- Households
CREATE TABLE households (
    id BIGSERIAL PRIMARY KEY,
    household_name VARCHAR(100) NOT NULL,
    formal_address VARCHAR(200),
    address_style VARCHAR(15) NOT NULL,
    head_guest_id BIGINT,
    assigned_table_id BIGINT REFERENCES seating_tables(id) ON DELETE SET NULL,
    workspace_id BIGINT NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    version BIGINT NOT NULL DEFAULT 0
);

CREATE INDEX idx_households_workspace ON households(workspace_id);
CREATE INDEX idx_households_assigned_table ON households(assigned_table_id);
