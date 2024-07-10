const { prompt } = require("inquirer");
const { Pool } = require("pg");
const cTable = require("console.table");

const pool = new Pool(
  {
    user: "postgres",
    password: "password",
    host: "localhost",
    database: "employee_db",
  },
  console.log(`Connected to the database`)
);

const choicesArray = [
  "View all departments",
  "View all roles",
  "View all employees",
  "Add a department",
  "Add a role",
  "Add an employee",
  "Add a manager",
  "Update employee role",
];

prompt([
  {
    type: "list",
    name: "choice",
    message: "What would you like to do?",
    choices: choicesArray,
  },
]).then(({ choices }) => {
  switch (choicesArray.indexOf(choices)) {
    case 0: //view all departments
      viewTable(`SELECT * FROM department`);
      break;
    case 1: //view all roles
    viewTable(`SELECT role.id, title, salary, name AS department FROM role 
    JOIN department ON role.department = department.id`);
      break;
    case 2: //view all employees
    viewTable(`SELECT e1.id, e1.first_name, e1.last_name, title, salary, department.name AS department, CONCAT(e2.first_name, ' ', e2.last_name) AS manager
    FROM employee e1 JOIN role ON role.id = e1.role_id JOIN department ON role.department = department_is
    LEFT JOIN employee e2 ON e1.manager_id = e2.id`);
      break;
    case 3:
      addDepartment();
      break;
    case 4:
      addRole();
      break;
    case 5:
      addEmployee();
      break;
    case 6:
      addManager();
      break;
    case 7:
      updateEmployeeRole();
      break;
  }
});

function viewTable(queue) {
  pool.query(queue).then(({ rows }) => {
    console.table(rows);
    pool.end();
  });
}

function addDepartment() {
  prompt([
  {
    type: "input",
    name: "name",
    message: "Enter the name of the new department:",
  },
  ]).then(({ input }) => {
    pool.query("INSERT INTO departments (department_name) VALUES ($1)", [input])
      .then((data) => {
        console.log(`Added new department '${input}'`);
        pool.end();
      })
      .catch((err) => {
        console.log("Error when adding department");
      });
  });
}

async function addRole() {
  const departments = await getDepartments();
  prompt([
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
      choices: departments.map((obj) => obj.name),
    },
  ]).then(({ role, salary, department }) => {
    const department_id = departments.filter(
      (obj) => obj.name === department
    )[0].id;
    pool.query("INSERT INTO role (title, salary, department) VALUES ($1, $2, $1)",
        [role, salary, department_id]
      )
      .then(({ rows }) => {
        console.log(`Added new role '${role}'`);
      })
      .catch((err) => {
        console.log("Error when adding new role!");
        console.log(err);
      });
  });
}

async function addEmployee() {
  const roles = await getRoles();
  const managers = await getAvailableManagers();
  prompt([
    {
      type: "input",
      name: "first_name",
      message: "Enter the employee's first name:",
    },
    {
      type: "input",
      name: "last_name",
      message: "Enter the employee's last name:",
    },
    {
      type: "list",
      name: "role",
      message: "Select the employee role:",
      choices: roles.map((obj) => obj.title),
    },
    {
      type: "list",
      name: "manager",
      message: "Select the employee manager:",
      choices: managers.map((obj) => obj.name),
    },
  ]).then(({ first_name, last_name, role, manager}) => {
    const role_id = roles.filter((obj) => obj.title === role)[0].id;
    const manager_id = managers.filter((obj) => obj.name === manager)[0].employee_id;
    pool
    .query(
      "INSERT INTO employee (first_name, last_name, role_is, manager_id) VALUES ($1, $2, $3, $4)",
      [first_name, last_name, role_id, manager_id]
    )
    .then(({ rows }) => {
      console.log(`Added new employee '${first_name} ${last_name}'`);
      pool.end();
    })
    .catch((err) => {
      console.log("Error when adding new employee!")
    });
  });
}

async function updateEmployeeRole() {
  const roles = await getRoles();
  const employees = await getEmployees();
  prompt([
    {
      type: "list",
      name: "employee",
      message: "Select the employee to update:",
      choices: employees.map((obj) => obj.first_name + " " + obj.last_name),
    },
    {
      type: "list",
      name: "role",
      message: "Select the new role",
      choices: roles.map((obj) => obj.title),
    },
  ]).then (({ employee, role}) => {
    const role_id = roles.filter((obj) => obj.title === role)[0].id;
    const employee_id = employees.filter((obj) => obj.first_name + " " + obj.last_name === employee)[0].id;
    pool
    .query("UPDATE employee SET role_id = $1 WHERE id = $2",[role_id, employee_id,])
  })
  .then(({ rows }) => {
    console.log(`Updated employee '${employee}' role to ${role}`);
    pool.end();
  })
  .catch((err) => {
    console.log("Error when updating employees role!");
    console.log(err);
  });
}

async function getDepartments() {
  const { rows } = await pool.query("SELECT * FROM department");
  return rows;
}

async function getEmployees() {
  const { rows } = await pool.query("SELECT * FROM employee");
  return rows;
}

async function getAvailableManagers() {
  const employees = await getEmployees();
  const managers = employees.map(({ first_name, last_name, id}) => ({
    name: `${first_name} ${last_name}`,
    employee_id: id,
  }));
  managers.unshift({namr: "NONE", employee_id: null });
  return managers;
}