# ShopKart 🛍️✨

**ShopKart** is a state-of-the-art, full-stack e-commerce platform engineered with high performance, hardened multi-layer security, and an ultra-modern user experience using the **MERN Stack** (MongoDB, Express.js, React.js, Node.js) and **Tailwind CSS**.

---

## 🌟 Key Features

### 💳 Razorpay Payment Gateway & Order Lifecycle
- **Tamper-Proof Checkout:** Backend calculates order totals and taxes directly from database product records, ignoring client-side amount tampering.
- **HMAC SHA-256 Verification:** Generates cryptographic signature verification (`order_id + payment_id`) using `RAZORPAY_KEY_SECRET`.
- **Atomic Stock Management:** Automatically decrements item quantities upon confirmed payment using `{ stock: { $gte: quantity } }` to eliminate race conditions and prevent negative stock.
- **Order Progression Tracking:** Orders transition through a 4-stage progression: `PLACED ➔ CONFIRMED ➔ SHIPPED ➔ DELIVERED` with interactive status steppers for customers and admins.
- **Customer Order History:** Persistent order archives with detailed item breakdowns, shipping summaries, and live status badges.

### 🛡️ Admin Portal & Two-Factor Passkey Security
- **2-Tier Authorization:** Restricts admin routes to verified emails (`ADMIN_EMAIL`) plus a mandatory server-verified passkey (`ADMIN_KEY`).
- **Cryptographic Admin Sessions:** Entering the correct `ADMIN_KEY` issues a signed 4-hour JWT `admin_session` cookie and `x-admin-token` header, completely preventing DevTools/localStorage spoofing.
- **Order Management:** Filter in-flight orders, transition progression statuses, view customer contact cards, and safely delete orders with a custom confirmation modal.
- **Product & Inventory Management:** 
  - Add new products with direct Cloudinary image upload.
  - Edit prices, descriptions, categories, and replenish stock levels.
  - Price changes reflect instantly across customer carts and checkout sessions in real time.
  - Low stock (≤ 5 units) and Out-of-Stock alert indicators.

### 🔒 Enterprise-Grade Security Architecture
- **Brute-Force Rate Limiting:** Powered by `express-rate-limit` (10 auth attempts/15 min, 5 admin passkey attempts/15 min).
- **HTTP Security Headers:** Integrated `helmet` protecting against XSS, clickjacking, MIME-type sniffing, and cross-origin leaks.
- **ReDoS & Search Injection Guard:** Sanitizes regex control characters in `GET /products` search filters.
- **Strict Input & ID Validation:** Validates `mongoose.Types.ObjectId.isValid` across all route params to eliminate database CastError crashes.
- **Environment-Aware Cookies:** `httpOnly`, `sameSite: "strict"`, and `secure: process.env.NODE_ENV === "production"`.

### 🛒 Real-Time Cart & Wishlist
- **Normalized Cart Schema:** References `Product` ObjectIds instead of hardcoded amounts, ensuring price updates in the database always reflect immediately for users.
- **Stock Limit Enforcements:** Prevents customers from increasing cart quantities beyond warehouse inventory.
- **Reactive Global State:** Synchronized through React Context API across navigation badges, product buttons, and cart drawer.

---

## 🛠️ Tech Stack

- **Frontend:** React 18, Vite, React Router v6, Tailwind CSS, React Hot Toast, Axios
- **Backend:** Node.js, Express.js, Mongoose (MongoDB Atlas), Razorpay SDK, Cloudinary SDK, Multer, Helmet, Express Rate Limit, Bcrypt, JsonWebToken
- **Payment Gateway:** Razorpay
- **Image Storage:** Cloudinary

---

## 📡 REST API Reference

### 🔐 Authentication (`/customers`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :---: |
| `POST` | `/customers/register` | Register new customer account (Rate limited) | Public |
| `POST` | `/customers/login` | Authenticate customer and set JWT cookie (Rate limited) | Public |
| `GET` | `/customers/me` | Fetch authenticated profile and admin privileges | Private |
| `PATCH`| `/customers/change-password` | Update account password with length validation | Private |
| `POST` | `/customers/verify-admin-key`| Verify `ADMIN_KEY` and issue signed admin session token | Admin |
| `POST` | `/customers/logout` | Clear user and admin authentication cookies | Private |

### 📦 Products (`/products`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :---: |
| `GET` | `/products` | List products with ReDoS-safe search, category, sort | Public |
| `GET` | `/products/:id` | Fetch product details by ID | Public |
| `POST` | `/products` | Create product with Cloudinary image upload | Admin |
| `PUT` | `/products/:id` | Update product info, price, stock, or image | Admin |
| `DELETE`| `/products/:id` | Remove product from store catalog | Admin |

### 💳 Orders & Payments (`/api/orders`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :---: |
| `POST` | `/api/orders/create-payment-order` | Validate cart, check stock, create Razorpay order | Private |
| `POST` | `/api/orders/verify-payment` | Verify HMAC signature, place order, deduct stock | Private |
| `GET` | `/api/orders` | Customer order history (excludes abandoned carts) | Private |
| `GET` | `/api/orders/:id` | Detailed order info and tracking | Private |
| `DELETE`| `/api/orders/:id/cancel-pending` | Clean up unpaid/abandoned checkout order | Private |
| `GET` | `/api/orders/admin/all` | Admin order overview across all store orders | Admin |
| `PATCH`| `/api/orders/admin/:id/status` | Update progression (`PLACED` ➔ `DELIVERED`) | Admin |
| `DELETE`| `/api/orders/admin/:id` | Delete order record | Admin |

### 🛒 Cart & Wishlist (`/cart`, `/wishlist`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :---: |
| `GET` | `/cart` | Fetch populated cart items | Private |
| `POST` | `/cart/:productId` | Add item or increment quantity | Private |
| `PATCH`| `/cart/:productId` | Update item quantity (capped at stock) | Private |
| `DELETE`| `/cart/:productId` | Remove item from cart | Private |
| `GET` | `/wishlist` | Fetch customer wishlist | Private |
| `POST` | `/wishlist/:productId` | Add product to wishlist | Private |
| `DELETE`| `/wishlist/:productId` | Remove product from wishlist | Private |

---

## ⚙️ Environment Variables

Create a `.env` file in the `backend/` folder:

```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# Database
dbUrl=mongodb+srv://<username>:<password>@cluster0.mongodb.net/shopkart

# Authentication Secrets
JWT_SECRET=your_super_secret_jwt_key_here

# Admin Access
ADMIN_EMAIL=admin@shopkart.com
ADMIN_KEY=your_secret_admin_passkey_here

# Razorpay Payment Gateway
RAZORPAY_KEY_ID=rzp_test_your_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret_here

# Cloudinary Image CDN
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

---

## 🚀 Running Locally

### 1. Install Dependencies
```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Start Backend Server
```bash
cd backend
npm run dev
```
*Backend runs on `http://localhost:5000`*

### 3. Start Frontend Client
```bash
cd frontend
npm run dev
```
*Frontend runs on `http://localhost:5173`*

---

*Engineered with precision for real-world reliability, performance, and clean code standards.*
