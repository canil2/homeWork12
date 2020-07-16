var express = require("express");
var mysql = require("mysql");
var app = express();
var inquirer = require("inquirer");
const cTable = require("console.table");

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password",
  database: "database12",
});

con.connect(function (err) {
  if (err) {
    console.log("error", err);
    throw err;
  } else {
    callinquirer();
  }
});

var questions = [
  { name: "Add Employee", value: "addemp" },
  { name: "Add Department", value: "adddep" },
  { name: "Add Role", value: "addrole" },
  { name: "View Employee", value: "viewemp" },
  { name: "View Department", value: "viewdep" },
  { name: "View Role", value: "viewrole" },
  { name: "Update Employee Role", value: "updateemp" },
];

function viewemp() {
  con.query("SELECT * from employee", function (err, emprows) {
    if (err) console.log("error in viewing employees", err);
    else {
      console.table(emprows);
      callinquirer();
    }
  });
}

function viewdep() {
  con.query("SELECT * from department", function (err, rows) {
    if (err) console.log("error in viewing deparment", err);
    else {
      console.table(rows);
      callinquirer();
    }
  });
}

function adddep() {
  inquirer
    .prompt([
      {
        type: "number",
        name: "departmentid",
        message: "Give a Department Id",
      },
      {
        type: "input",
        name: "departmentname",
        message: "Give a Department Name",
      },
    ])
    .then(function (ans) {
      var depname = "Testing";
      var queryString =
        "INSERT INTO department (id,name) VALUES (" +
        ans.departmentid +
        ",'" +
        ans.departmentname +
        "')";
      con.query(queryString, function (err, data) {
        if (err) console.log("error while adding department", err);
        else {
          console.log("New Department added");
          callinquirer();
        }
      });
    });
}

function viewrole() {
  con.query("SELECT * from role", function (err, rows) {
    if (err) console.log("error in viewing role", err);
    else {
      console.table(rows);
      callinquirer();
    }
  });
}

function addrole() {
  inquirer
    .prompt([
      {
        type: "number",
        name: "roleid",
        message: "Give a Role Id",
      },
      {
        type: "input",
        name: "rolename",
        message: "Give a Role Name",
      },
      {
        type: "number",
        name: "salary",
        message: "Give a Salary to this role",
      },
      {
        type: "number",
        name: "depid",
        message: "Give a Department Id to this role",
      },
    ])
    .then(function (ans) {
      var queryString =
        "INSERT INTO role (id,title,salary,departmentid) VALUES (" +
        ans.roleid +
        ",'" +
        ans.rolename +
        "'," +
        ans.salary +
        "," +
        ans.depid +
        ")";

      con.query(queryString, function (err, data) {
        if (err) console.log("error while adding department", err);
        else {
          console.log("New Department added");
          callinquirer();
        }
      });
    });
}

function addemp() {
  inquirer
    .prompt([
      {
        type: "number",
        name: "empid",
        message: "Give an employee Id",
      },
      {
        type: "input",
        name: "firstname",
        message: "What is his first name",
      },
      {
        type: "input",
        name: "lastname",
        message: "What is his last name",
      },
      {
        type: "number",
        name: "roleid",
        message: "Give a role Id he belongs to",
      },
      {
        type: "number",
        name: "managerid",
        message: "Give his manager's employee id",
      },
    ])
    .then(function (ans) {
      var queryString =
        "INSERT INTO employee (id,first_name,last_name,roleid,managerid) VALUES (" +
        ans.empid +
        ",'" +
        ans.firstname +
        "','" +
        ans.lastname +
        "'," +
        ans.roleid +
        "," +
        ans.managerid +
        ")";

      con.query(queryString, function (err, data) {
        if (err) console.log("error while adding employee", err);
        else {
          console.log("New employee added");
          callinquirer();
        }
      });
    });
}

function updateemp() {
  inquirer
    .prompt([
      {
        type: "number",
        name: "empid",
        message: "Select Employee To Update",
      },
    ])
    .then(function (ans) {
      var selque = "SELECT * from employee where id=" + ans.empid;
      con.query(selque, function (err, emprow) {
        if (err) console.log("Error while finding the employee", err);
        else {
          if (emprow.length == 0) {
            console.log("No employee found");
            callinquirer();
          } else {
            inquirer
              .prompt([
                {
                  type: Number,
                  name: "roleid",
                  message: "Enter New Role Id for the employee",
                },
              ])
              .then(function (roleans) {
                var fullque =
                  "UPDATE employee SET roleid = " +
                  roleans.roleid +
                  " WHERE id = " +
                  ans.empid;

                con.query(fullque, function (error1, data1) {
                  if (error1) {
                    console.log("error happened while updating", error1);
                  } else {
                    console.log("Employee Role Updated");
                    callinquirer();
                  }
                });
              });
          }
        }
      });
    });
}

function callinquirer() {
  inquirer
    .prompt([
      {
        type: "list",
        name: "operation",
        message: "choose operation you want to do",
        choices: questions,
      },
    ])
    .then(function (answers) {
      //View Employee
      switch (answers.operation) {
        case "viewemp":
          viewemp();
          break;
        case "viewdep":
          viewdep();
          break;
        case "viewrole":
          viewrole();
          break;
        case "adddep":
          adddep();
          break;
        case "addrole":
          addrole();
          break;
        case "addemp":
          addemp();
          break;
        case "updateemp":
          updateemp();
          break;
      }
    });
}

app.listen(7000);
