# ShopKart 🛒

**ShopKart** is a modern e-commerce web platform designed to provide a fast, secure, and seamless shopping experience for customers.

This repository hosts the **Backend Engineering Service** for ShopKart, starting with **Lab 01: Customer Authentication Service**, which provides the foundational user account security and identity management for the entire platform.

---

## 🚀 About the Project

In an e-commerce platform, security and privacy are paramount. The **Customer Authentication Service** provides secure, sessionless REST APIs that allow customers to:

- **Create an account** with encrypted credentials.
- **Log in securely** using stateless JSON Web Tokens (JWT).
- **Maintain authenticated sessions** using tamper-proof **HttpOnly Cookies** (preventing XSS attacks).
- **Access their personal profile** securely via authenticated routes.
- **Change passwords** safely with old password verification.
- **Log out** by invalidating browser-stored credentials.

---

## 🛠️ Technology Stack

Built strictly adhering to core Node.js & Express MVC architecture without third-party auth frameworks (like Passport or Firebase):

- **Runtime:** [Node.js](https://nodejs.org/)
- **Web Framework:** [Express.js](https://expressjs.com/) (v5)
- **Database & ODM:** [MongoDB Atlas](https://www.mongodb.com/atlas) with [Mongoose](https://mongoosejs.com/)
- **Password Security:** [bcrypt](https://www.npmjs.com/package/bcrypt) (10 salt rounds)
- **Token Management:** [jsonwebtoken (JWT)](https://www.npmjs.com/package/jsonwebtoken)
- **Cookie Handling:** [cookie-parser](https://www.npmjs.com/package/cookie-parser)
- **Configuration:** [dotenv](https://www.npmjs.com/package/dotenv)

---

## 📁 Project Architecture (MVC)

```text
backend/
│
├── controllers/
│   └── customer.controller.js   # Core business logic (register, login, me, change-password, logout)
│
├── models/
│   └── customer.model.js        # Mongoose Schema with unique indexes and timestamps
│
├── routes/
│   └── customer.routes.js       # Customer API endpoints
│
├── middlewares/
│   └── auth.middleware.js       # JWT cookie verification & user hydration (req.user)
│
├── utils/
│   └── generateToken.js         # JWT generator utility
│
├── index.js                     # Express server & DB connection entry point
├── package.json
└── .env                         # Environment configurations
```

---

## 📡 API Endpoints

| Method | Endpoint | Description | Protected |
| :--- | :--- | :--- | :---: |
| `POST` | `/customers/register` | Register a new customer | ❌ |
| `POST` | `/customers/login` | Log in and receive HttpOnly cookie | ❌ |
| `GET` | `/customers/me` | Fetch authenticated customer profile | ✅ |
| `PATCH` | `/customers/change-password` | Change customer password | ✅ |
| `POST` | `/customers/logout` | Clear auth cookie | ✅ |

---

## ⚙️ Getting Started

### 1. Prerequisites
- Node.js (v18+)
- MongoDB Atlas connection URI or local MongoDB instance

### 2. Installation
```bash
cd backend
npm install
```

### 3. Environment Variables
Create a `.env` file in the `backend/` folder:
```env
PORT=5000
dbUrl=your_mongodb_connection_uri/shopkart?appName=Cluster0
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
```

### 4. Run the Server
```bash
# Development mode (with nodemon)
npm run dev

# Production mode
npm start
```
Server runs on: `http://localhost:5000`
