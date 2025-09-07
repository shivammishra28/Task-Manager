# 📝 Task Manager App

A full-stack MERN Task Management Web App with authentication, task CRUD, search, filters, pagination, and a clean UI built with **React, Express, MongoDB, and Tailwind CSS**.

---

## ✨ Features

- 🔐 **Authentication** – Register & Login with JWT (httpOnly cookies).  
- 📝 **Task Management** – Create, Read, Update, Delete tasks.  
- 🎯 **Filters & Search** – Search by title/description, filter by status.  
- 📄 **Pagination** – Navigate through tasks easily.  
- ⚡ **Optimistic Updates** – Smooth UI updates using React Query.  
- 🎨 **Modern UI** – Built with TailwindCSS (minimal & responsive).  
- 🚀 **Production Ready** – Secure password hashing, clean architecture, environment configs.  

---

## 📂 Project Structure

task-manager/
├── backend/ # Backend (Express + MongoDB)
│ ├── src/
│ │ ├── models/ # Mongoose models (User, Task)
│ │ ├── controllers/ # Route controllers (auth, task)
│ │ ├── routes/ # Express routes
│ │ ├── middlewares/ # Auth, error handlers
│ │ └── utils/ # Helpers (JWT, asyncHandler)
│ └── .env.example
│
├── frontend/ # Frontend (React + Vite + Tailwind)
│ ├── src/
│ │ ├── pages/ # Login, Register, Dashboard, TaskForm
│ │ ├── components/ # Navbar, TaskCard, Pagination
│ │ └── api/axios.js # Axios instance
│ └── .env.example
│
└── README.md


---

## 🚀 Getting Started

### 1️⃣ Clone the Repo
```bash
git clone https://github.com/shivammishra28/Task-Manager
cd task-manager
```

##2️⃣ Setup Backend
cd server
cp .env.example .env   # fill in your values (MongoDB URI, JWT secret, etc.)
npm install
npm run dev

### 3️⃣ Setup Frontend
cd ../client
cp .env.example .env   # set API URL (default: http://localhost:8000/api)
npm install
npm run dev2️⃣ Setup Backend
cd server
cp .env.example .env   # fill in your values (MongoDB URI, JWT secret, etc.)
npm install
npm run dev

### 3️⃣ Setup Frontend
cd ../client
cp .env.example .env   # set API URL (default: http://localhost:8000/api)
npm install
npm run dev


## Security Highlights:

Passwords are hashed using bcrypt.

JWT stored in httpOnly cookies (prevents XSS).

CORS configured with credentials.
