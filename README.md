# 🚀  CRM System

A modern **CRM (Customer Relationship Management)** system built for a software training institute to manage leads, counsellors, and sales workflows efficiently.

---

## ✨ Features

### 🔐 Authentication
- JWT-based login system
- Secure API communication
- Role-based access control (RBAC)

### 👥 User Roles
- 🧑‍💼 Sales Manager (Admin)
- 🎓 Academic Counsellors

### 📊 Dashboard
- Modern UI with analytics
- Lead tracking system
- Performance overview

### 🎨 UI/UX
- Built with TailwindCSS
- Clean & responsive design
- Multiple theme options 🌈

---

## 🧱 Tech Stack

### Frontend
- Next.js
- TailwindCSS
- Axios
- Redux (optional)
- JWT Authentication

### Backend
- NestJS
- TypeORM
- PostgreSQL
- REST API
- Role-based authorization

---

## 🗄️ Database

- PostgreSQL
- Entity-based schema using TypeORM

---

## ⚙️ Installation

### 1. Clone the repository

```bash
git clone https://github.com/Hashim-stack/crm-nest-next-sales.git
cd upcode-crm
2. Backend Setup (NestJS)
cd backend
npm install

Create .env file:

PORT=3000
DATABASE_URL=postgresql://user:password@localhost:5432/upcode_crm
JWT_SECRET=your_secret_key

Run backend:

npm run start:dev
3. Frontend Setup (Next.js)
cd frontend
npm install
npm run dev
🔑 API Authentication

All protected routes require:

Authorization: Bearer <token>
📌 API Structure
/auth → Login/Register
/users → User management
/leads → Lead tracking
/dashboard → Analytics
🌍 Deployment

Frontend:

Vercel

Backend:

Render / Railway / VPS

Database:

PostgreSQL (Railway / Supabase)
📸 Screenshots

Add your UI screenshots here 🔥

🧠 Future Improvements
Notifications system
AI-based lead scoring 🤖
WhatsApp/email automation
Advanced analytics
👨‍💻 Author

Hashim


⭐ Support

If you like this project, give it a ⭐ on GitHub!


---

# 🔐 Pro Tip (IMPORTANT)

Even with this license:

- If your repo is **public**, people can still *see* the code 👀  
- But legally → they **cannot use it**

👉 If you want **full protection**, do one of these:
- Keep repo **private** 🔒
- Or show only demo version publicly

---
