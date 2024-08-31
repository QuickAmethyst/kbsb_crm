CREATE TYPE data_type AS ENUM ('string', 'number', 'date', 'picklist');
CREATE TABLE fields (
    id VARCHAR(36) PRIMARY KEY,
    object_id VARCHAR(36) NOT NULL,
    organization_id INT NOT NULL,
    created_by_id INT NOT NULL,
    updated_by_id INT,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP,
    label VARCHAR(255) NOT NULL,
    data_type data_type NOT NULL,
    default_value TEXT,
    is_indexed BOOL DEFAULT FALSE,
    is_required BOOL DEFAULT FALSE,

    UNIQUE(object_id, label),
    CONSTRAINT fk_object_id FOREIGN KEY (object_id) REFERENCES objects (id)
);

