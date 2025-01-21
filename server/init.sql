CREATE DATABASE IF NOT EXISTS ReadyToFly;
USE ReadyToFly;

CREATE TABLE IF NOT EXISTS Airport (
    id INT AUTO_INCREMENT PRIMARY KEY,
    short_form VARCHAR(10) NOT NULL,
    name VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS Flight (
    id INT AUTO_INCREMENT PRIMARY KEY,
    departure_id INT NOT NULL,
    arrival_id INT NOT NULL,
    duration INT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    appreciation VARCHAR(1500)
);

CREATE TABLE IF NOT EXISTS user (
    id INT AUTO_INCREMENT,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    pw VARCHAR(255) NOT NULL,
    PRIMARY KEY (id),
    UNIQUE (email),
);

CREATE TABLE IF NOT EXISTS user_session (
    fk_user_id INT,
    expirationDate DATETIME NOT NULL,
    token VARCHAR(255) NOT NULL,
    PRIMARY KEY (token),
    FOREIGN KEY (fk_user_id) REFERENCES user(id)
);

ALTER TABLE Flight ADD INDEX (departure_id);
ALTER TABLE Flight ADD INDEX (arrival_id);

ALTER TABLE Flight
    ADD CONSTRAINT fk_departure
    FOREIGN KEY (departure_id) REFERENCES Airport(id) ON DELETE CASCADE;

ALTER TABLE Flight
    ADD CONSTRAINT fk_arrival
    FOREIGN KEY (arrival_id) REFERENCES Airport(id) ON DELETE CASCADE;

ALTER TABLE Flight 
    ADD COLUMN user_id INT NOT NULL

ALTER TABLE Flight
    ADD CONSTRAINT fk_user
    FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE;

UPDATE Flight
    SET user_id = 1;