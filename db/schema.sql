\c postgres;
DROP DATABASE IF EXISTS employee_db;
CREATE DATABASE employee_db;
 
 \c employee_db;

CREATE TABLE department (
id SERIAL PRIMARY KEY,
name VARCHAR(30) UNIQUE NOT NULL
);

CREATE TABLE role (
id SERIAL PRIMARY KEY,
title VARCHAR(30) UNIQUE NOT NULL,
salary DECIMAL NOT NULL,
department INTEGER NOT NULL,
FOREIGN KEY (department)
REFERENCES department(id)
ON DELETE SET NULL
);

CREATE TABLE employee (
id SERIAL PRIMARY KEY,
first_name VARCHAR(30) NOT NULL,
last_name VARCHAR(30) NOT NULL,
role_id INTEGER NOT NULL,
department INTEGER NOT NULL,
FOREIGN KEY (role_id)
REFERENCES role(id)
ON DELETE SET NULL
);

\i seeds.sql;