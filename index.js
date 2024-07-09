const { prompt } = require("inquirer");
const { pool } = require("pg");


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
        name: "choices",
        message: "What would you like to do?",
    },
]).then(({ choices }) => {
  switch (choicesArray.indexOf(choices)) {
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


