# TeamTask

![Landing Page](home.png)
<p align="center"><em>Landing page: Welcome and entry point for users</em></p>

![Login](login.png)
<p align="center"><em>Login page: Secure user authentication</em></p>

![Register](register.png)
<p align="center"><em>Register page: Create a new account as user or manager</em></p>

![Dashboard](dashboard.png)
<p align="center"><em>Dashboard: View, manage, and track tasks</em></p>

![Edit](edit.png)
<p align="center"><em>Edit Task: Managers can edit task details in a modal</em></p>

![Not found Page](found.png)
<p align="center"><em>Not Found: Custom 404 page for invalid routes</em></p>




TeamTask is a modern, full-stack task management application for teams. It features user authentication, role-based access (manager/user), task assignment, and a responsive, user-friendly interface.

## Features
- User registration and login
- Role-based access: manager and user
- Managers can create, assign, edit, and delete tasks
- Users can view and update their assigned tasks
- Beautiful UI with Bootstrap and custom gradients
- RESTful API with Express and MongoDB

## Project Structure
```
teamtask/
├── backend/         # Node.js/Express/MongoDB API
├── frontend/        # React + Bootstrap client
```

## Getting Started

### Backend
1. `cd backend`
2. `npm install`
3. Create a `.env` file with your MongoDB URI and JWT secret:
   ```
   MONGO_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   ```
4. `npm start`

### Frontend
1. `cd frontend`
2. `npm install`
3. `npm run dev`

## Usage
- Visit `http://localhost:5173` (or the port shown in your terminal)
- Register as a user or manager
- Managers can assign tasks to users
- Users can update the status of their tasks


