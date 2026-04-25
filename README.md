<div align="center">

# 🍔 QuickBite

### Smart Canteen Ordering System with AI-Powered Insights

[![Python](https://img.shields.io/badge/Python-3.10+-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-18.2-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-5.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-3.3-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?style=for-the-badge&logo=mysql&logoColor=white)](https://mysql.com)

<br/>

**QuickBite** is a full-stack canteen ordering platform that streamlines food ordering with a modern, animated UI, role-based access control, and **Gemini AI-powered analytics** — built with **FastAPI** and **React**.

<br/>

[Features](#-features) · [Tech Stack](#-tech-stack) · [Architecture](#-architecture) · [Getting Started](#-getting-started) · [API Reference](#-api-reference) · [Project Structure](#-project-structure)

---

</div>

<br/>

## ✨ Features

### 👤 Customer Experience
| Feature | Description |
|---------|-------------|
| **Browse Menu** | View food items organized by category with rich image cards |
| **Smart Cart** | Add items, adjust quantities, and review totals — persisted to `localStorage` |
| **Place Orders** | Schedule a pickup time and place orders seamlessly |
| **Order Tracking** | Track order status in real-time (Pending → Preparing → Ready) |
| **Profile Management** | Upload profile pictures via Cloudinary integration |
| **Demo Mode** | Try the app instantly without registration |

### 🔐 Admin Dashboard
| Feature | Description |
|---------|-------------|
| **Menu Management** | Full CRUD operations — add, edit, and delete menu items with image uploads |
| **Order Management** | View all incoming orders and update statuses (pending / preparing / ready) |
| **AI Insights** | Gemini-powered analytics: busiest hours, popular foods, and smart summaries |
| **Analytics Charts** | Visual charts for peak ordering hours and top menu items using Recharts |

### 🛡️ Security & Auth
| Feature | Description |
|---------|-------------|
| **JWT Authentication** | Secure token-based auth with configurable expiration |
| **Bcrypt Password Hashing** | Industry-standard password security via Passlib |
| **Role-Based Access Control** | Separate user and admin permissions with route guards |
| **Protected Routes** | Frontend route protection for authenticated and admin-only pages |

<br/>

## 🛠 Tech Stack

### Backend
| Technology | Purpose |
|------------|---------|
| **FastAPI** | High-performance Python web framework with auto-generated docs |
| **SQLAlchemy** | ORM for database modeling and query management |
| **MySQL** | Relational database (via PyMySQL driver) |
| **Pydantic** | Request/response validation and serialization |
| **JWT (python-jose)** | Token-based authentication |
| **Passlib + Bcrypt** | Secure password hashing |
| **Cloudinary** | Cloud-based image upload and storage |
| **Google Gemini AI** | AI-powered analytics and natural language insights |

### Frontend
| Technology | Purpose |
|------------|---------|
| **React 18** | Component-based UI library |
| **Vite 5** | Lightning-fast build tool and dev server |
| **Tailwind CSS 3** | Utility-first CSS framework for rapid styling |
| **React Router v6** | Client-side routing with protected route guards |
| **Framer Motion** | Fluid page transitions and micro-animations |
| **Recharts** | Data visualization for admin analytics dashboard |
| **Lucide React** | Beautiful, consistent icon library |
| **Axios** | HTTP client with JWT interceptor for API calls |

<br/>

## 🏗 Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT (React + Vite)                    │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌───────────────┐   │
│  │ Landing  │  │   Menu   │  │   Cart   │  │ Admin Dashboard│  │
│  │  Page    │  │  Browse  │  │ Checkout │  │  + AI Insights │  │
│  └──────────┘  └──────────┘  └──────────┘  └───────────────┘   │
│         │            │            │               │             │
│         └────────────┴────────────┴───────────────┘             │
│                          │ Axios + JWT                          │
└──────────────────────────┼──────────────────────────────────────┘
                           │ HTTP / REST
┌──────────────────────────┼──────────────────────────────────────┐
│                     SERVER (FastAPI)                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────┐    │
│  │ Auth     │  │ Menu     │  │ Order    │  │ AI Insights  │    │
│  │ Router   │  │ Router   │  │ Router   │  │ Router       │    │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └──────┬───────┘    │
│       │              │             │               │            │
│       └──────────────┴─────────────┴───────────────┘            │
│                          │ SQLAlchemy ORM                       │
│  ┌───────────────────────┼──────────────────────────────────┐   │
│  │              MySQL Database (quickbite)                   │   │
│  │  ┌────────┐  ┌──────────┐  ┌────────┐  ┌─────────────┐  │   │
│  │  │ users  │  │   menu   │  │ orders │  │ order_items  │  │   │
│  │  └────────┘  └──────────┘  └────────┘  └─────────────┘  │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────┐  ┌──────────────────────────────────┐  │
│  │  Cloudinary (CDN)   │  │  Google Gemini AI (Insights)     │  │
│  │  Image Uploads      │  │  Natural Language Summaries      │  │
│  └─────────────────────┘  └──────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

<br/>

## 🗄️ Database Schema

```
┌──────────────────┐       ┌──────────────────┐
│      users       │       │       menu       │
├──────────────────┤       ├──────────────────┤
│ id (PK)          │       │ id (PK)          │
│ name             │       │ name             │
│ email (UNIQUE)   │       │ price            │
│ password (hash)  │       │ image_url        │
│ role             │       │ category         │
│ profile_image_url│       └────────┬─────────┘
└────────┬─────────┘                │
         │                          │
         │ 1:N                      │ 1:N
         ▼                          ▼
┌──────────────────┐       ┌──────────────────┐
│      orders      │       │   order_items    │
├──────────────────┤       ├──────────────────┤
│ id (PK)          │◄──────│ id (PK)          │
│ user_id (FK)     │  1:N  │ order_id (FK)    │
│ total_price      │       │ menu_id (FK)     │
│ pickup_time      │       │ quantity         │
│ status           │       └──────────────────┘
│ created_at       │
└──────────────────┘
```

<br/>

## 🚀 Getting Started

### Prerequisites

| Requirement | Version |
|-------------|---------|
| Python | 3.10+ |
| Node.js | 18+ |
| MySQL | 8.0+ |
| Cloudinary Account | [Sign up](https://cloudinary.com) |
| Google Gemini API Key | [Get key](https://aistudio.google.com/apikey) |

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/your-username/quickbite.git
cd quickbite
```

### 2️⃣ Backend Setup

```bash
# Navigate to backend
cd backend

# Create and activate virtual environment
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # macOS/Linux

# Install dependencies
pip install fastapi uvicorn sqlalchemy pymysql python-jose[cryptography] \
            passlib[bcrypt] python-dotenv pydantic[email] cloudinary \
            python-multipart google-genai
```

### 3️⃣ Configure Environment Variables

Create a `backend/.env` file:

```env
# Database
DATABASE_URL=mysql+pymysql://root:your_password@localhost:3306/quickbite

# JWT Authentication
SECRET_KEY=your_super_secret_jwt_key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=10080

# Google Gemini AI
Gemini__ApiKey=your_gemini_api_key

# Cloudinary
Cloudinary__CloudName=your_cloud_name
Cloudinary__ApiKey=your_api_key
Cloudinary__ApiSecret=your_api_secret
```

Create a `frontend/.env` file:

```env
VITE_API_URL=http://localhost:8000
```

### 4️⃣ Initialize the Database

```sql
-- In MySQL CLI or Workbench
CREATE DATABASE quickbite;
```

> **Note:** Tables are created automatically by SQLAlchemy when the backend starts.

### 5️⃣ Start the Backend

```bash
cd backend
uvicorn main:app --reload --port 8000
```

The API will be available at `http://localhost:8000` with interactive docs at `/docs`.

### 6️⃣ Frontend Setup

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`.

<br/>

## 📡 API Reference

### Authentication
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/auth/register` | Register a new user (with optional profile image) | ❌ |
| `POST` | `/auth/login` | Login and receive JWT token | ❌ |

### Users
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/users/me` | Get current user profile | 🔒 User |
| `POST` | `/users/upload-profile` | Upload profile image to Cloudinary | 🔒 User |

### Menu
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/menu` | Get all menu items | ❌ |
| `POST` | `/menu` | Add a new menu item (with image) | 🔒 Admin |
| `PUT` | `/menu/{item_id}` | Update a menu item | 🔒 Admin |
| `DELETE` | `/menu/{item_id}` | Delete a menu item | 🔒 Admin |

### Orders
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/orders` | Get all orders (admin view) | 🔒 Admin |
| `POST` | `/orders/` | Place a new order | 🔒 User |
| `GET` | `/orders/my` | Get current user's orders | 🔒 User |
| `PUT` | `/orders/{order_id}/status` | Update order status | 🔒 Admin |

### AI Analytics
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/ai/insights` | Get AI-powered analytics (busy hours, popular foods, summary) | ❌ |

> 📖 **Interactive API Docs:** Visit `http://localhost:8000/docs` for the full Swagger UI documentation.

<br/>

## 📁 Project Structure

```
Quick Bite/
│
├── backend/                          # FastAPI Backend
│   ├── main.py                       # Application entry point & router registration
│   ├── database.py                   # MySQL engine, session factory, connection pooling
│   ├── models.py                     # SQLAlchemy ORM models (User, MenuItem, Order, OrderItem)
│   ├── schemas.py                    # Pydantic request/response schemas
│   ├── auth.py                       # JWT token creation, password hashing, route guards
│   ├── cloudinary_config.py          # Cloudinary image upload configuration
│   ├── routers/
│   │   ├── auth_router.py            # Registration & login endpoints
│   │   ├── user_router.py            # User profile & image upload endpoints
│   │   ├── menu_router.py            # Menu CRUD operations (admin-protected)
│   │   ├── order_router.py           # Order placement & status management
│   │   └── ai_router.py             # Gemini AI analytics & insights
│   └── .env                          # Environment variables (not committed)
│
├── frontend/                         # React + Vite Frontend
│   ├── index.html                    # HTML entry point with Google Fonts
│   ├── package.json                  # Dependencies & scripts
│   ├── vite.config.js                # Vite build configuration
│   ├── tailwind.config.js            # Tailwind CSS theme customization
│   ├── vercel.json                   # Vercel deployment configuration
│   └── src/
│       ├── main.jsx                  # React DOM render entry
│       ├── App.jsx                   # Route definitions & auth guards
│       ├── index.css                 # Global styles & Tailwind directives
│       ├── api/
│       │   └── axios.js              # Axios instance with JWT interceptor
│       ├── context/
│       │   ├── AuthContext.jsx        # Authentication state management
│       │   └── CartContext.jsx        # Shopping cart state (localStorage-backed)
│       ├── components/
│       │   ├── Navbar.jsx            # Responsive navigation with mobile drawer
│       │   ├── FoodCard.jsx          # Menu item display card
│       │   └── OrderStatusBadge.jsx  # Color-coded order status indicator
│       └── pages/
│           ├── Landing.jsx           # Hero landing page for new visitors
│           ├── Login.jsx             # User login with demo mode option
│           ├── Register.jsx          # User registration with image upload
│           ├── Menu.jsx              # Browsable menu with category filtering
│           ├── Cart.jsx              # Shopping cart with quantity controls
│           ├── Checkout.jsx          # Order review & pickup time selection
│           ├── OrderHistory.jsx      # Past orders with status tracking
│           ├── Profile.jsx           # User profile with avatar upload
│           └── AdminDashboard.jsx    # Admin panel: menu CRUD, orders, AI insights
│
└── .gitignore                        # Git ignore rules
```

<br/>

## 🎨 UI Highlights

- **🌙 Dark Theme** — Sleek dark UI with warm flame-orange accents
- **✨ Framer Motion** — Smooth page transitions and interactive micro-animations
- **📱 Fully Responsive** — Mobile-first design with collapsible navigation drawer
- **🎯 Category Filtering** — Browse menu items by food category
- **📊 Admin Charts** — Visual analytics with Recharts bar/line graphs
- **🖼️ Cloud Images** — All food and profile images served via Cloudinary CDN
- **🔤 Custom Typography** — Outfit, DM Sans, and Playfair Display font families

<br/>

## 🔑 Default Roles

| Role | Capabilities |
|------|-------------|
| **`user`** | Browse menu, add to cart, place orders, track order status, manage profile |
| **`admin`** | All user capabilities + manage menu items, update order statuses, view AI insights |

> **Tip:** Register with `role: admin` to access the admin dashboard at `/admin`.

<br/>

## 🧪 Demo Mode

QuickBite includes a **Demo Mode** that allows users to explore the interface without creating an account. Click "Try Demo" on the login page to get instant access with sample data.

<br/>

## 📦 Deployment

### Frontend (Vercel)
The frontend includes a `vercel.json` with SPA rewrites configured. Deploy directly from your GitHub repository via the [Vercel Dashboard](https://vercel.com).

### Backend
Deploy the FastAPI backend to any Python-compatible platform:
- **Railway** — One-click deploy with MySQL add-on
- **Render** — Free tier available with managed PostgreSQL
- **AWS / GCP / Azure** — For production-grade deployments

<br/>

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

<br/>

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

<br/>

---

<div align="center">

**Built with ❤️ using FastAPI & React**

[![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=flat-square&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev)
[![Gemini](https://img.shields.io/badge/Gemini_AI-4285F4?style=flat-square&logo=google&logoColor=white)](https://ai.google.dev)
[![Cloudinary](https://img.shields.io/badge/Cloudinary-3448C5?style=flat-square&logo=cloudinary&logoColor=white)](https://cloudinary.com)

</div>
