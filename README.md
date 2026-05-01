# LeadMaster CRM

[![Built with MERN](https://img.shields.io/badge/Built%20with-MERN%20Stack-blue.svg)](https://www.mongodb.com/mern-stack)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A high-performance, enterprise-ready Lead Management System designed to streamline the journey from lead acquisition to conversion. Featuring automated **Round-Robin Assignment**, multi-level **Role-Based Access Control (RBAC)**, and real-time activity tracking.

---

## Core Features

- **Intelligent Lead Capture**: Seamless landing page integration for high-conversion lead acquisition.
- **Automated Round-Robin**: Fair and automated lead distribution among active and approved administrators.
- **Multi-Level RBAC**: Distinct interfaces and permissions for **Super Admins** and **Admins**.
- **Dynamic Dashboards**: Real-time visualization of lead statuses, conversion rates, and performance metrics.
- **Real-time Notifications**: Instant alerts for new lead assignments and system updates.
- **Secure Authentication**: Robust JWT-based security with OTP-verified registrations and password management.

---

## Technical Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Vite, Tailwind CSS, Redux Toolkit, React Router 6 |
| **Backend** | Node.js, Express.js, MongoDB (Mongoose) |
| **Auth** | JWT (JSON Web Tokens), bcryptjs, Cookie-based sessions |
| **Icons & UI** | Lucide React, Framer Motion (Animations), Headless UI |

---

## User Interface Showcase

### Landing & Public Access
The public-facing portal is optimized for conversion with a clean, focused lead capture form.

![Landing Page](./screenshots/landing.png)

### Authentication Flow
Secure entrance for administrators with modern validation and OTP verification.

| Login | Registration |
|---|---|
| ![Login](./screenshots/login.png) | ![Register](./screenshots/register.png) |

---

## Administrator Experience

### Dashboard
Admins manage their personal lead pipeline with at-a-glance metrics and quick-action tools.

![Admin Dashboard](./screenshots/admin_dashboard.png)

### Lead Management
A centralized hub for tracking lead progress, updating statuses, and managing client interactions.

![Admin Leads](./screenshots/admin_leads.png)

---

## Super Administrator Control

### Executive Oversight
The Super Admin dashboard provides a bird's-eye view of the entire organization's performance.

![Super Admin Dashboard](./screenshots/superadmin_dashboard.png)

### Team Management
Granular control over the administrative team, including approval workflows and round-robin pool management.

![Manage Admins](./screenshots/superadmin_admins.png)

---

## API Architecture

The LeadMaster API is built following RESTful principles, ensuring scalability and ease of integration.

### Authentication Endpoints
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/v1/auth/login` | Secure administrator access |
| `POST` | `/api/v1/auth/signup` | OTP-verified onboarding |
| `POST` | `/api/v1/auth/logout` | Session termination |

### Lead Operations
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `POST` | `/api/v1/leads/public` | Public lead submission | Public |
| `GET` | `/api/v1/leads` | Assigned lead retrieval | Admin |
| `POST` | `/api/v1/leads/create` | Manual lead generation | Admin |
| `PUT` | `/api/v1/leads/:id/status` | Pipeline stage update | Admin |

### System Governance
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/api/v1/superAdmin/admins` | Team audit | Super Admin |
| `PUT` | `/api/v1/superAdmin/approve/:id` | Status authorization | Super Admin |
| `PUT` | `/api/v1/superAdmin/deactivate/:id` | Resource management | Super Admin |

---

## Project Structure

```text
CRM/
├── client/                # Frontend (React + Vite)
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Dashboard & Routing views
│   │   ├── services/      # API communication layer
│   │   └── store/         # Redux state management
├── server/                # Backend (Node + Express)
│   ├── controllers/       # Business logic handlers
│   ├── models/            # MongoDB schemas
│   ├── routes/            # API endpoints
│   └── middlewares/       # Auth & Role validation
└── screenshots/           # Documentation assets
```

---

## Getting Started

1. **Install Dependencies**:
   ```bash
   npm run install-all
   ```

2. **Environment Setup**:
   Copy `.env.example` to `.env` in the project root and fill in your values.

3. **Launch Application**:
   ```bash
   npm run server
   npm run client
   ```

---

## Deployment

### Backend on Render

Create a **Web Service** for the `server/` directory.

| Setting | Value |
|---|---|
| Root Directory | `server` |
| Build Command | `npm install` |
| Start Command | `npm start` |

You can also use the included `render.yaml` as a Render Blueprint.

Add these Render environment variables:

```env
NODE_ENV=production
PORT=4000
MONGODB_URL=mongodb+srv://USERNAME:PASSWORD@CLUSTER.mongodb.net/leadmaster-crm?retryWrites=true&w=majority
JWT_SECRET=replace-with-a-long-random-secret
SUPER_ADMIN_EMAIL=admin@example.com
SUPER_ADMIN_PASSWORD=replace-with-a-strong-password
FRONTEND_URL=https://your-vercel-app.vercel.app
ALLOWED_ORIGINS=https://your-vercel-app.vercel.app
ALLOW_VERCEL_PREVIEWS=false
MAIL_HOST=smtp.example.com
MAIL_USER=your-smtp-user
MAIL_PASS=your-smtp-password
```

In MongoDB Atlas, create a cluster, create a database user, and add Render outbound access in **Network Access**. For a quick first deploy you can use `0.0.0.0/0`, then tighten it later if your Render plan gives stable outbound IPs.

### Frontend on Vercel

Create a Vercel project for the `client/` directory.

| Setting | Value |
|---|---|
| Framework Preset | Vite |
| Root Directory | `client` |
| Build Command | `npm run build` |
| Output Directory | `dist` |

Add this Vercel environment variable:

```env
VITE_API_BASE_URL=https://your-render-service.onrender.com/api/v1
```

After Vercel gives you the final URL, add that exact URL to Render as both `FRONTEND_URL` and `ALLOWED_ORIGINS`, then redeploy the backend.

---

© 2026 LeadMaster CRM. Built for excellence.
