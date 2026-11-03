# 📊 Project Tracker (Next.js Stack)

A modern full-stack project management and Kanban workspace built with **Next.js 15 (App Router)**, **TypeScript**, **Tailwind CSS**, and **MongoDB**.

---

## ⚡ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router & Route Handlers)
- **Language**: TypeScript
- **Styling**: Tailwind CSS & Glassmorphism Design
- **Database**: MongoDB with [Mongoose](https://mongoosejs.com/)
- **Authentication**: JWT (JSON Web Tokens) & `bcryptjs`
- **Icons**: Lucide React

---

## ✨ Features

- 🔐 **Authentication**: User registration and login with encrypted passwords and JWT stateless session management.
- 📁 **Workspaces**: Isolated project spaces with team collaboration and user invitations.
- 📋 **Kanban Board**: Drag/move tasks between **To Do**, **In Progress**, and **Done** workflow stages.
- 🎯 **Task Management**: Priorities (Low, Medium, High), due dates, assignees, real-time search, and priority filtering.
- 📈 **Progress Tracking**: Real-time completion progress calculation.
- 💎 **Modern UI**: Polished dark-mode glassmorphism theme with fluid responsive layout.

---

## 🚀 Getting Started

### 1. Environment Setup

Create a `.env.local` file in the root of the project:

```env
# MongoDB Connection String (Atlas or Local)
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.example.mongodb.net/project_tracker?retryWrites=true&w=majority

# JWT Secret Key
JWT_SECRET=your-super-secret-jwt-key
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production

```bash
npm run build
npm start
```

---

## 📁 Project Structure

```
project-manager-app/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/         # Register, Login, Me endpoints
│   │   │   ├── projects/     # Projects CRUD & Invite API
│   │   │   └── tasks/        # Tasks CRUD & Status API
│   │   ├── globals.css       # Tailwind CSS & Glass styling
│   │   ├── layout.tsx        # Next.js Root Layout
│   │   └── page.tsx          # Main Dashboard & Client Controller
│   ├── components/
│   │   ├── AuthView.tsx      # Sign in / Sign up form
│   │   ├── Navbar.tsx        # Header & Project Switcher
│   │   ├── KanbanBoard.tsx   # 3-Column Kanban Board
│   │   ├── TaskCard.tsx      # Task Card Component
│   │   ├── TaskModal.tsx     # Create / Edit Task Modal
│   │   ├── ProjectModal.tsx  # Create Project Modal
│   │   └── InviteModal.tsx   # Team Collaboration Modal
│   └── lib/
│       ├── auth.ts           # JWT utilities & Auth middleware
│       ├── mongodb.ts        # Cached Mongoose connection
│       ├── types.ts          # TypeScript interfaces
│       └── models/           # Mongoose Data Models (User, Project, Task)
├── .env.example
├── .env.local
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```
