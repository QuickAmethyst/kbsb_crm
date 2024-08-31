CREATE TABLE IF NOT EXISTS indexes (
     record_id VARCHAR(36),
     field_id VARCHAR(36),
     created_by_id INT NOT NULL,
     created_at TIMESTAMP NOT NULL,
     string_value TEXT,
     number_value NUMERIC,
     date_value TIMESTAMP,
     PRIMARY KEY (record_id, field_id),
     CONSTRAINT fk_record_id FOREIGN KEY (record_id) REFERENCES records (id),
     CONSTRAINT fk_field_id FOREIGN KEY (field_id) REFERENCES fields (id)
);

CREATE INDEX idx_string_value ON indexes (string_value);
CREATE INDEX idx_number_value ON indexes (number_value);
CREATE INDEX idx_date_value ON indexes (date_value);
