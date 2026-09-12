CREATE DATABASE IF NOT EXISTS trip_raja
CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE trip_raja;

CREATE TABLE IF NOT EXISTS launch_subscribers (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    email VARCHAR(190) NOT NULL,
    submitted_at_utc DATETIME NOT NULL,
    last_seen_at_utc DATETIME NULL,
    PRIMARY KEY (id),
    UNIQUE KEY uq_email (email)
) ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_unicode_ci;
