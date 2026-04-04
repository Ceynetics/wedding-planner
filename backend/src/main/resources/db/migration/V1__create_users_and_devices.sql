CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    age INTEGER,
    gender VARCHAR(10),
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(100),
    phone VARCHAR(20),
    bio VARCHAR(500),
    avatar_url VARCHAR(500),
    oauth_provider VARCHAR(10),
    oauth_provider_id VARCHAR(255),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    version BIGINT NOT NULL DEFAULT 0
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_oauth ON users(oauth_provider, oauth_provider_id);

CREATE TABLE user_devices (
    id BIGSERIAL PRIMARY KEY,
    fcm_token VARCHAR(255) NOT NULL UNIQUE,
    device_type VARCHAR(10) NOT NULL,
    device_name VARCHAR(100),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    version BIGINT NOT NULL DEFAULT 0
);

CREATE INDEX idx_user_devices_user_id ON user_devices(user_id);
CREATE INDEX idx_user_devices_token ON user_devices(fcm_token);
