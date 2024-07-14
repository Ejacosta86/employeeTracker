DELETE FROM department;
INSERT INTO department (name)
VALUES
('Sales'),
('Engineering'),
('Finance'),
('Legal');

DELETE FROM role;
INSERT INTO role (title, salary, department)
VALUES
('Sales Lead', 65000, 1),
('Sales person', 50000, 1),
('Lead Engineer', 100000, 2),
('Software Engineer', 85000, 2),
('Account Manager', 105000, 3),
('Accountant', 85000, 3),
('Legal Team Lead', 250000, 4),
('Lawyer', 125000, 4);

DELETE FROM employee;
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
('Anna', 'Wolff', 1, null),
('Mike', 'Duffey', 2, 1),
('Micah', 'Cox', 3, null),
('Paula', 'Keldsen', 4, 3),
('Scott', 'Okamoto', 3, null),
('Jessica', 'Song', 3, 5),
('Erica', 'Acosta', 4, null),
('Jung', 'Yoon', 4, 4);