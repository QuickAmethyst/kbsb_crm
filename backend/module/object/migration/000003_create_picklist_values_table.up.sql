CREATE TABLE IF NOT EXISTS picklist_values (
    id VARCHAR(36) PRIMARY KEY,
    field_id VARCHAR(36) NOT NULL,
    value TEXT NOT NULL,
    UNIQUE(field_id, value),
    CONSTRAINT fk_field_id FOREIGN KEY (field_id) REFERENCES fields (id)
);
