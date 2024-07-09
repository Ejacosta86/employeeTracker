DELETE FROM department;
INSERT INTO departments (name)
VALUES
('Sale'),
('Engineering'),
('Finance'),
('Legal');

DELETE FROM role;
INSERT INTO roles (title, salary, department)
VALUES
('Sales Lead', 65000, 1),
('Salesperson', 50000, 1),
('Lead Engineer', 100000, 2),
('Software Engineer', 85000, 2),
('Account Manager', 105000, 3),
('Accountant', 85000, 3),
('Legal Team Lead', 250000, 4),
("Lawyer", 125000, 4);

DELETE FROM employee;
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
("Anna", "Wolff", 1, null),
("Mike", "Duffey", 2, 1),
("Micah", "Cox", 3, null),
("Paula", "Keldsen", 4, 3),
("Scott", "Okamoto", 5, null),
("Jessica", "Song", 6, 5),
("Erica", "Acosta", 7, null),
("Jung", "Yoon", 8, 7);