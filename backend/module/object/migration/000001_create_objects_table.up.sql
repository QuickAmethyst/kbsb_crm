CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE TABLE IF NOT EXISTS objects (
    id VARCHAR(36) PRIMARY KEY,
    organization_id INT NOT NULL,
    name VARCHAR(255),
    description TEXT,
    UNIQUE (organization_id, name)
);