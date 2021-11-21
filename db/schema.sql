DROP DATABASE IF EXISTS employee_db;
CREATE DATABASE employee_db;
USE employee_db;
 
 
 
 CREATE TABLE employee (
     id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
     first_name VARCHAR(30) NOT NULL,
     last_name VARCHAR(30) NOT NULL,
     role_id INTEGER,
     manager_id INTEGER

 );

 CREATE TABLE role (
     id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
     title VARCHAR(30) NOT NULL,
     salary DECIMAL (9,2) NOT NULL,
     department_id INTEGER 
 );


 CREATE TABLE department (
     id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
     name VARCHAR(30) NOT NULL
 );

