SELECT 
    employee.id,
    employee.first_name,
    employee.last_name,
    role.title,
    role.salary,
    department.name,
    manager.last_name AS manager
    FROM employee JOIN role ON employee.role_id = role.id
    JOIN department ON role.department_id = department.id
    LEFT JOIN employee manager ON employee.manager_id = manager.id
