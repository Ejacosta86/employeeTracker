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
    console.log("Connected to the database!")
    startQuestions();
})

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
                "Delete departments | Roles | Employees",
                "View the total utilized budget of a department",
                "Exit",
            ],
        })
        .then((answer) => {
            switch(answer.action) {
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
                case "View employee by manager":
                    viewEmployeesByManager();
                    break;
                case "View employee by department":
                    viewEmployeeByDepartment();
                    break;
                case "Delete departments | Roles | Employees":
                    deleteDepartmentsRolesEmployees();
                    break;
                case "View the total utilized budget of a department":
                    viewTotalUtilizedBudgetOfDepartment();
                    break;
                case "Exit":
                    connection.end();
                    console.log("You have exited");
                    break;
            }
        });
}

