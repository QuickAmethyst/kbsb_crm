CREATE TABLE IF NOT EXISTS objects (
     id VARCHAR(36) PRIMARY KEY,
     name VARCHAR(255) UNIQUE,
     description TEXT
);