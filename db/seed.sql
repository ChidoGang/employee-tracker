INSERT INTO employee (id, first_name,last_name,role_id,manager_id )
VALUES
(1,'Loan','Shark',1, NULL),
(2,'Alex','Garcia',2,4 ),
(3,'Ed','Doe',3,2 ),
(4,'Ali','Allen',4,1 );
INSERT INTO role (id,title,salary,department_id)
VALUES 
(1,'Software Engineer',150000,1),
(2,'Sales Lead',55000,2),
(3,'Lawyer',90000,3),
(4,'Accountant',75000,4);

INSERT INTO department (id,name)
VALUES 
(1,'Engineering'),
(2,'Sales'),
(3,'Legal'),
(4,'Finance');
