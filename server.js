const inquirer = require("inquirer");
const mysql = require("mysql2");

//create connection
const connection = mysql.createConnection({
  host: "localhost",
  port: 3001,
  user: "root",
  password: "",
  database: "employeeTracker_db",
});

//connect to the database
connection.connect((err) => {
  if (err) throw err;
  console.log("Connected to the database!");
  startQuestions();
});

function startQuestions() {
  inquirer
    .createPromptModule({
      type: "list",
      name: "profile",
      message: "What would you like to do?",
      choices: [
        "View all departments",
        "View all roles",
        "View all employees",
        "Add a department",
        "Add a role",
        "Add an employee",
        "Add a manager",
        "Update employee role",
        "View employees by Manager",
        "View employees by Department",
        "Exit",
      ],
    })
    .then((answer) => {
      switch (answer.action) {
        case "View all departments":
          viewAllDepartments();
          break;
        case "View all role":
          viewAllRoles();
          break;
        case "View all employees":
          viewAllEmployees();
          break;
        case "Add a department":
          addDepartment();
          break;
        case "Add a role":
          addRole();
          break;
        case "Add an employee":
          addEmployee();
          break;
        case "Add a Manager":
          addManager();
          break;
        case "Update an employee role":
          updateEmployeeRole();
          break;
      }
    });
}

function viewAllDepartments() {
  const query = `SELECT * FROM departments;`;
  connection.query(query, (err, res) => {
    if (err) throw err;
    console.table(res);
    startQuestions();
  });
}

function viewAllRoles() {
  const query = `SELECT roles.title, roles.id, departments.department_name, roles.salary from roles join departments on roles.department_id = departments.id;`;
  connection.query(query, (err, res) => {
    if (err) throw err;
    console.table(res);
    startQuestions();
  });
}

function viewAllEmployees() {
  const query = `
    SELECT e.id, e.first_name, e.last_name, r.title, d.department_name, r.salary, CONCAT(m.first_name, '',m.last_name) AS manager_name
    FROM employee e
    LEFT JOIN roles r ON e.role_id = r.id
    LEFT JOIN departments d ON r.department_id = d.is
    LEFT JOIN employee m ON e.manager_id = m.id;
    `;
  connection.query(query, (err, res) => {
    if (err) throw err;
    console.table(res);
    startQuestions();
  });
}

function addDepartment() {
  inquirer
    .prompt({
      type: "input",
      name: "name",
      message: "Enter the name of the new department:",
    })
    .then((answer) => {
      console.log(answer.name);
      const query = `INSERT INTO departments (department_name) VALUES ("${answer.name}")`;
      connection.query(query, (err, res) => {
        if (err) throw err;
        console.log(`Added department ${answer.name} to the database`);
        startQuestions();
      });
    });
}

function addRole() {
  const query = "SELECT * FROM departments";
  connection.query(query, (err, res) => {
    if (err) throw err;
    inquirer
      .prompt([
        {
          type: "input",
          name: "title",
          message: "Enter the title of new role",
        },
        {
          type: "input",
          name: "salary",
          message: "Enter the salary of the new role",
        },
        {
          type: "list",
          name: "department",
          message: "Select the department for new role",
          choices: res.map((department) => department.department_name),
        },
      ])
      .then((answers) => {
        const department = res.find(
          (department) => department.name === answers.department
        );
        const query = "INSERT INTO roles SET ?";
        connection.query(
          query,
          {
            title: answers.title,
            salary: answers.salary,
            department_id: department,
          },
          (err, res) => {
            if (err) throw err;
            console.log(
              `Added role ${answers.title} with salary ${answers.salary} to the ${answers.department} department in the database`
            );
            startQuestions();
          }
        );
      });
  });
}

function addEmployee() {
  connection.query("SELECT id, title FROM roles", (error, results) => {
    if (error) {
      console.error(error);
      return;
    }

    const roles = results.map(({ id, title }) => ({
      name: title,
      value: id,
    }));

    connection.query(
      'SELECT id, CONCAT(first_name, " ", last_name) AS name FROM employee',
      (error, results) => {
        if (error) {
          console.error(error);
          return;
        }

        const managers = results.map(({ id, name }) => ({
          name,
          value: id,
        }));

        inquirer
          .prompt([
            {
              type: "input",
              name: "firstName",
              message: "Enter the employee's first name:",
            },
            {
              type: "input",
              name: "lastName",
              message: "Enter the employee's last name:",
            },
            {
              type: "list",
              name: "roleId",
              message: "Select the employee role:",
              choices: roles,
            },
            {
              type: "list",
              name: "managerId",
              message: "Select the employee manager:",
              choices: [{ name: "None", value: null }, ...managers],
            },
          ])
          .then((answers) => {
            const sql =
              "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)";
            const values = [
              answers.firstName,
              answers.lastName,
              answers.roleId,
              answers.managerId,
            ];
            connection.query(sql, values, (error) => {
              if (error) {
                console.error(error);
                return;
              }

              console.log("Employee added successfully");
              startQuestions();
            });
          })
          .catch((error) => {
            console.error(error);
          });
      }
    );
  });
}

function addManager() {
  const queryDepartments = "SELECT * FROM departments";
  const queryEmployees = "SELECT * FROM employee";

  connection.query(queryDepartments, (err, resDepartments) => {
    if (err) throw err;
    connection.query(queryEmployees, (err, resEmployees) => {
      if (err) throw err;
      inquirer
        .prompt([
          {
            type: "list",
            name: "department",
            message: "Select the department:",
            choices: resDepartments.map(
              (department) => department.department_name
            ),
          },
          {
            type: "list",
            name: "employee",
            message: "Select the employee to add a manager to:",
            choices: resEmployees.map(
              (employee) => `${employee.first_name} ${employee.last_name}`
            ),
          },
          {
            type: "list",
            name: "manager",
            message: "Select the employee's manager:",
            choices: resEmployees.map(
              (employee) => `${employee.first_name} ${employee.last_name}`
            ),
          },
        ])
        .then((answers) => {
          const department = resDepartments.find(
            (department) => department.department_name === answers.department
          );
          const employee = resEmployees.find(
            (employee) =>
              `${employee.first_name} ${employee.last_name}` ===
              answers.employee
          );
          const manager = resEmployees.find(
            (employee) =>
              `${employee.first_name} ${employee.last_name}` === answers.manager
          );
          const query =
            "UPDATE employee SET manager_id = ? WHERE id = ? AND rold_id IN (SELECT id FROM roles WHERE department_id = ?)";
          connection.query(
            query,
            [manager.id, employee.id, department.id],
            (err, res) => {
              if (err) throw err;
              console.log(
                `Added manager ${manager.first_name} ${manager.last_name} to employee ${employee.first_name} ${employee.last_name} in department ${department.department_name}!`
              );
              startQuestions();
            }
          );
        });
    });
  });
}

function updateEmployeeRole() {
  const queryEmployees =
    "SELECT employee.id, employee.first_name, employee.last_name, roles.title FROM employee LEFT JOIN roles ON employee.role_id = roles.id";
  const queryRoles = "SELECT * FROM roles";
  connection.query(queryEmployees, (err, resEmployees) => {
    if (err) throw err;
    inquirer
      .prompt([
        {
          type: "list",
          name: "employee",
          message: "Select the employee to update:",
          choices: resEmployees.map(
            (employee) => `${employee.first_name} ${employee.last_name}`
          ),
        },
        {
          type: "list",
          name: "role",
          message: "Select the new role",
          choices: resRoles.map((role) => role.title),
        },
      ])
      .then((answers) => {
        const employee = resEmployees.find(
          (employee) =>
            `${employee.first_name} ${employee.last_name}` === answers.employee
        );
        const role = resRoles.find((role) => role.title === answers.role);
        const query = "UPDATE employee SET role_is = ? WHERE id = ?";
        connection.query(query, [role.id, employee.id], (err, res) => {
          if (err) throw err;
          console.log(
            `Updated ${employee.first_name} ${employee.last_name}'s role to ${role.title} in the database!`
          );
          startQuestions();
        });
      });
  });
}

process.on("exit", () => {
  connection.end();
});
