CREATE TABLE IF NOT EXISTS records (
     id VARCHAR(36) PRIMARY KEY,
     object_id VARCHAR(36) NOT NULL,
     organization_id INT NOT NULL,
     created_by_id INT NOT NULL,
     updated_by_id INT,
     created_at TIMESTAMP NOT NULL,
     updated_at TIMESTAMP,
     data JSONB,

     CONSTRAINT fk_object_id FOREIGN KEY (object_id) REFERENCES objects (id)
);

