# ShopKart 🛒

**ShopKart** is a modern, full-stack e-commerce application designed to provide a fast, secure, and seamless shopping experience for customers.

Built from the ground up using the **MERN Stack** (MongoDB, Express, React, Node.js), ShopKart features a fully responsive UI built with Tailwind CSS and a robust, secure RESTful API backend.

---

## ✨ Features

- **Authentication System:** Secure customer registration, login, profile management, and password changing with JWT and HttpOnly Cookies.
- **Product Catalog:** Dynamic product discovery with search, category filtering, and sorting fetched directly from the database.
- **Product Details:** Individual pages displaying product information, pricing, stock availability, and a beautiful UI.
- **Wishlist Management:** Customers can save products to their personal wishlist securely stored in MongoDB using database references (ObjectIds) to avoid duplication.
- **Beautiful UI/UX:** Built with Tailwind CSS, the application offers premium, modern design aesthetics including micro-animations, glassmorphism, responsive grids, and subtle shadows.

---

## 🛠️ Technology Stack

### Frontend (Client)
- **Framework:** React.js (via Vite)
- **Routing:** React Router v6
- **Styling:** Tailwind CSS
- **HTTP Client:** Axios (with interceptors for cookies/credentials)
- **State Management:** React Hooks (`useState`, `useEffect`, `useContext` for Auth)

### Backend (Server)
- **Runtime:** Node.js
- **Web Framework:** Express.js
- **Database & ODM:** MongoDB Atlas with Mongoose
- **Security:** bcrypt (password hashing), JSON Web Tokens (JWT)
- **Middleware:** cookie-parser, cors, custom authentication guards (`protectRoute`)

---

## 📁 Project Architecture

The project is split into two distinct directories:

### Frontend (`/frontend`)
Component-based React architecture heavily utilizing Tailwind utility classes for rapid UI development. Communicates with the backend exclusively via REST APIs.

### Backend (`/backend`)
Follows a strict MVC (Model-View-Controller) pattern:
- **Models:** Mongoose schemas defining `Customer` and `Product` structures, including relational data (Wishlist references).
- **Controllers:** Business logic handling requests and sending JSON responses.
- **Routes:** API endpoint definitions mapped to controller functions.
- **Middlewares:** Authentication guards extracting and verifying JWTs from HttpOnly cookies.

---

## 📡 Core API Endpoints

### Authentication (`/customers`)
| Method | Endpoint | Description | Protected |
| :--- | :--- | :--- | :---: |
| `POST` | `/customers/register` | Register a new customer | ❌ |
| `POST` | `/customers/login` | Log in and receive HttpOnly cookie | ❌ |
| `GET` | `/customers/me` | Fetch authenticated customer profile | ✅ |
| `PATCH`| `/customers/change-password` | Change customer password | ✅ |
| `POST` | `/customers/logout` | Clear auth cookie | ✅ |

### Products (`/products`)
| Method | Endpoint | Description | Protected |
| :--- | :--- | :--- | :---: |
| `GET` | `/products` | Fetch all products (supports `search`, `category`, `sort` queries) | ❌ |
| `GET` | `/products/:id`| Fetch details for a specific product | ❌ |

### Wishlist (`/wishlist`)
| Method | Endpoint | Description | Protected |
| :--- | :--- | :--- | :---: |
| `GET` | `/wishlist` | Fetch the current customer's populated wishlist | ✅ |
| `POST` | `/wishlist/:productId`| Add a product to the customer's wishlist | ✅ |
| `DELETE`| `/wishlist/:productId`| Remove a product from the wishlist | ✅ |

---

## ⚙️ Getting Started

### 1. Prerequisites
- Node.js (v18+)
- MongoDB Atlas connection URI or local MongoDB instance

### 2. Installation

Clone the repository, then install dependencies for both ends:

**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
cd frontend
npm install
```

### 3. Environment Variables

Create a `.env` file in the `backend/` folder:
```env
PORT=8000
dbUrl=your_mongodb_connection_uri/shopkart
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
```

*(Note: The frontend expects the backend to run on `http://localhost:8000` by default via Vite proxy or Axios base URL configuration).*

### 4. Running the Application

You will need two terminal windows.

**Terminal 1 (Backend):**
```bash
cd backend
npm run dev
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm run dev
```

The frontend will start on `http://localhost:5173` and the backend on `http://localhost:8000`.

---
*Built with ❤️ as part of the ShopKart Engineering Labs.*
