
const inquirer =require('inquirer');
const { query } = require('./db/connection');
const db =require('./db/connection');


function init (){
  console.log(`
  ██████████████████████████████████████████████████████████████████████████████████████████████
  █▄─▄▄─█▄─▀█▀─▄█▄─▄▄─█▄─▄███─▄▄─█▄─█─▄█▄─▄▄─█▄─▄▄─███─▄─▄─█▄─▄▄▀██▀▄─██─▄▄▄─█▄─█─▄█▄─▄▄─█▄─▄▄▀█
  ██─▄█▀██─█▄█─███─▄▄▄██─██▀█─██─██▄─▄███─▄█▀██─▄█▀█████─████─▄─▄██─▀─██─███▀██─▄▀███─▄█▀██─▄─▄█
  ▀▄▄▄▄▄▀▄▄▄▀▄▄▄▀▄▄▄▀▀▀▄▄▄▄▄▀▄▄▄▄▀▀▄▄▄▀▀▄▄▄▄▄▀▄▄▄▄▄▀▀▀▀▄▄▄▀▀▄▄▀▄▄▀▄▄▀▄▄▀▄▄▄▄▄▀▄▄▀▄▄▀▄▄▄▄▄▀▄▄▀▄▄▀`)

  startMenu();

};

function startMenu() {
  inquirer.prompt([
    {
      type:'list',
      name:'choice',
      message:'What would you like to do?',
      choices: [
        "Show all Departments",
          "Add a Department",
          "Show All Roles",
          "Add a Role",
          "Show all Employees",
          "Add an Employee",
          "Update an Employees role"
      ]
    }
  ]).then(function (results){
    switch(results.choice){
      case 'Show All Roles': displayRoles();
        break;
      case 'Add a Role': addRole();
        break;
      case 'Show all Departments':displayDepartments();
        break;
      case 'Add a Department': addDepartment();
        break;
      case"Show all Employees": displayEmployees();
        break;
      case'Add an Employee': addEmployee();
        break;
      case"Update an Employees role": updateEmployeesRole();
        break;
    }
  })
}

function displayRoles() {
   const sql = `SELECT 
           role.id,
            role.title,
             role.salary,
              department.name AS department
                FROM role JOIN department ON role.department_id =department.id`; 
   db.query(sql, (err, table) => {
       if (err) throw err;
        
    const transformed = table.reduce((acc, {id, ...x}) => { acc[id] = x; return acc}, {});
      console.table(transformed);
      startMenu();
  });                
}

function displayDepartments() { 
  const sql =`SELECT * FROM department`;
  db.query(sql, (err, table) => {
    if (err) throw err;

    const transformed = table.reduce((acc, {id, ...x}) => { acc[id] = x; return acc}, {});
    console.table(transformed);
    startMenu();
})
}

function addRole() {
  db.query('select department.name FROM department ', (err,results) => {
    let depArr = [];
    
    for(let i=0; i<results.length; i++) {
      let department =results[i].name;

      depArr.push(department);
    }
      inquirer.prompt([
        {
          type:'input',
          name:'role',
          message:'What title do you want to add to this role?.'
        },
        {
          type:'input',
          name:'salary',
          message:'What is the salary of this role?'
        },

      {
        type:'list',
        name:'department',
        message:'Please select the department you would like to give to this role', 
        choices:depArr
      }
      ]).then(function(data){
        const sql =`SELECT id from department WHERE name = '${data.department}'`;
        const role =data.role;
        const salary=data.salary;

        db.query(sql,(err,data) => {
          if(err) throw err; 
        const id=data[0].id;

        const sql2 =`INSERT INTO role (title,salary,department_id)
                        VALUES (' ${role} ',' ${salary} ',' ${id} ')` 
          
         db.query(sql2,(err) => {
           if(err) throw err;

            startMenu();
           })
          
        })
     })
  }) 
}

function addDepartment() {
  inquirer.prompt ([
    {
      type:'input',
      name:'department',
      message:'What department would you like to add?'
  }

]).then(function(data){
  db.query(`INSERT INTO department (name) VALUES ('${data.department}')`, (err) => {
      if (err) throw err;
      startMenu(); 
  });
});
}

function displayEmployees() {
const sql = `SELECT 
employee.id,
employee.first_name,
employee.last_name,
role.title,
role.salary,
department.name,
manager.last_name AS manager
FROM employee JOIN role ON employee.role_id = role.id
JOIN department ON role.department_id = department.id
LEFT JOIN employee manager ON employee.manager_id = manager.id`

db.query(sql, (err, table) => {
  if (err) throw err;

  const transformed = table.reduce((acc, {id, ...x}) => { acc[id] = x; return acc}, {});
  console.table(transformed);
    startMenu(); 
}) 
}

function addEmployee () {
  db.query( `SELECT title FROM role `, (err,results) => {
    let depArr = [];
    for(let i=0; i<results.length; i++) {
      let role =results[i].title;

      depArr.push(role); 
    } 
    inquirer.prompt([
      {
        type:'input',
        name:'first',
        message:'What is the employees first name?.'
      },
      {
        type:'input',
        name:'last',
        message:'What is the new employees last name?'
      },

    {
      type:'list',
      name:'title',
      message:'What is the new employees title?', 
      choices:depArr
    }
   ]).then(function(name) {
     const sql=`SELECT first_name,last_name FROM employee`
     const first =name.first;
     const last=name.last;
     const title=name.title;

     db.query(sql,(err,name) => {
       if(err) throw err;
      let manArr =['No Manager'];
      for(let i=0; i<name.length; i++) {
        let manager =name[i].first_name+' '+name[i].last_name;

        manArr.push(manager);
      }
      inquirer.prompt([
        {
          type:'list',
          name:'question',
          message:'Who is the manager?.',
          choices:manArr
        }
      
     ]).then(function(quest) {
      let manager = quest.question
      manager = manager.split(' ')
      const firstname=manager[0];
      const lastname=manager[1];
      const sql=`SELECT id FROM role WHERE title='${title}'`
      db.query(sql,(err,roleid)=>{
        if(err) throw err;
        const rid=roleid[0].id
        const sql2 =`SELECT id FROM employee WHERE first_name ='${firstname}' AND last_name ='${lastname}'`
        db.query(sql2,(err,employee_id) => { 
          if(err) throw err;  

          let eid;
          if(firstname!='No' && lastname !=  'Manager'){
            eid=employee_id[0].id
          }

          let sql3=`INSERT INTO employee (first_name,last_name,role_id,manager_id)
          VALUES('${first}','${last}',${rid},${eid})` 
          if(firstname==='No' && lastname === 'Manager'){
            sql3 = `INSERT INTO employee (first_name,last_name,role_id,manager_id)
            VALUES('${first}','${last}',${rid},null)`
          } 
          db.query(sql3,(err) =>{
            if(err) throw err;
            startMenu();
          }) 
          
      })
    })
     
      
     })

     })
   })
})
}

function updateEmployeesRole  () {
  db.query("SELECT * FROM employee", function (err, resEmployee) {
      if (err) throw err;

      let employeeArray = [];
      for (i = 0; i < resEmployee.length; i++) {
          employeeArray.push(resEmployee[i].first_name+' '+resEmployee[i].last_name)
      }

      db.query("SELECT * FROM role", function (err, resRole) {
          if (err) throw err;

          let roleArray = [];
          for (j = 0; j < resRole.length; j++) {
              roleArray.push(resRole[j].title);
          }

          inquirer.prompt([
              {
                  type: "list",
                  name: "name",
                  message: "Which employee?",
                  choices: employeeArray,
              },
              {
                  type: "list",
                  name: "role",
                  message: "New role?",
                  choices: roleArray,
              }
          ])
          .then(function (response) {
              let employeeID;
              for (k = 0; k < resEmployee.length; k++) {
                  if (response.name == resEmployee[k].first_name+' '+resEmployee[k].last_name) {
                      employeeID = resEmployee[k].id;
                  }
                }

              let roleID;
              for (l = 0; l < resRole.length; l++) {
                  if (response.role == resRole[l].title) {
                      roleID = resRole[l].id;
                  }
                }

              db.query("UPDATE employee SET role_id = ? WHERE id = ?", [roleID, employeeID], function (err) {
                  if (err) throw err;
                  console.log(response.name, "has been updated to the role of", response.role);
                  startMenu();
              }
              )
          })
      })
  })
};



db.connect(err => {
  if( err ) throw err
});

init() 
