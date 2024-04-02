Railfy Backend API
This repository contains the backend codebase for Railfy, a task management application. Railfy's backend is built using TypeScript, Express.js, and Node.js.

Controllers
Railfy's backend provides the following endpoints for managing tasks:

Create Task: POST /api/tasks

Creates a new task.
Request Body: { "title": "Task Title", "description": "Task Description", "maintainceDate": "YYYY-MM-DD", "dueDate": "YYYY-MM-DD", "days": 7 }
Response: { "message": "Task created successfully", "task": { /* Task Object */ } }
Update Task: PATCH /api/tasks/:id

Updates an existing task by its ID.
Request Body: { "title": "Updated Task Title", "description": "Updated Task Description", "maintainceDate": "YYYY-MM-DD", "dueDate": "YYYY-MM-DD", "days": 7 }
Response: { "message": "Task updated successfully", "task": { /* Updated Task Object */ } }
Delete Task: DELETE /api/tasks/:id

Deletes a task by its ID.
Response: { "message": "Task deleted successfully" }
Get All Tasks: GET /api/tasks

Retrieves all tasks.
Response: { "tasks": [ /* Array of Task Objects */ ] }
Get Task by ID: GET /api/tasks/:id

Retrieves a task by its ID.
Response: { "task": { /* Task Object */ } }
