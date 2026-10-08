# ShopKart 🛍️✨

![ShopKart Header](https://via.placeholder.com/1200x400/111111/FFFFFF?text=ShopKart+-+Premium+MERN+E-Commerce)

**ShopKart** is a state-of-the-art, full-stack e-commerce application engineered to deliver a blazing-fast, highly secure, and visually stunning shopping experience. 

Designed with a heavy emphasis on UI/UX and modern backend architecture, ShopKart serves as a comprehensive showcase of scalable full-stack development using the **MERN Stack** (MongoDB, Express.js, React.js, Node.js). 

---

## 🌟 Comprehensive Feature Set

### 🛡️ Robust Authentication & Security
- **JWT & HttpOnly Cookies:** Implements industry-standard authentication using JSON Web Tokens stored securely in HttpOnly, SameSite cookies to mitigate XSS and CSRF attacks.
- **Encrypted Credentials:** All sensitive user data, including passwords, is hashed and salted via `bcrypt` before reaching the database.
- **Protected Routing:** Strict frontend and backend route guards ensure that only authenticated customers can access private features like Wishlists, Carts, and Profile settings.
- **Session Management:** Seamless login, registration, password modification, and secure logout flows.

### 🛍️ Dynamic Product Discovery
- **Live Search & Filtering:** Customers can instantly filter thousands of products by category or search term, with URL query string synchronization to ensure that direct links to searches always load the correct results.
- **Smart Sorting:** Sort products dynamically by price (High-to-Low or Low-to-High) without reloading the page.
- **Inventory Tracking:** Real-time stock status is displayed prominently. Products with `0` stock dynamically update the UI to prevent purchases, graying out buttons and displaying "Out of Stock" badges.

### ❤️ Persistent Wishlist System
- **MongoDB Relationships:** Instead of duplicating product data, the wishlist utilizes Mongoose `ObjectId` references to build a relational bridge between the `Customer` and `Product` collections.
- **Graceful Degradation:** Wishlist badges fail silently for unauthenticated guest users to prevent annoying login popups, while still encouraging them to log in when attempting to add items.
- **Optimistic UI Updates:** Instant toggle behavior on the frontend provides a snappy user experience while background synchronization handles the heavy lifting with the database.

### 🛒 Intelligent Shopping Cart
- **Global State Management:** Powered by React Context API, the cart state is globally available, instantly updating the navbar badge, cart page, and product buttons simultaneously across the entire application.
- **Granular Quantity Controls:** Customers can smoothly increment, decrement, or remove items. The backend enforces strict validation to prevent adding more items than currently exist in inventory.
- **Dynamic Subtotals:** Live calculation of cart totals, syncing directly with the MongoDB persistent cart array so no items are lost upon page refresh.

### 🎨 Premium UI/UX & Aesthetics
- **Tailwind CSS Mastery:** The entire interface is built using custom Tailwind utility classes, completely avoiding generic component libraries.
- **Glassmorphism & Gradients:** Utilizes sleek backdrop blurs, soft drop-shadows, and dynamic animated background blobs for a luxurious, modern aesthetic.
- **Responsive By Design:** Flawless layout scaling from ultra-wide desktop monitors down to mobile devices, featuring a custom mobile navigation overlay.

---

## 🛠️ Technology Stack Deep Dive

### Frontend Architecture (Client)
- **Core:** React.js (v18), initialized via Vite for lightning-fast HMR and optimized builds.
- **Routing:** React Router v6 for declarative, component-based routing and parameter parsing (`useSearchParams`).
- **Styling:** Tailwind CSS for a highly customized, constraint-based design system.
- **Data Fetching:** Axios instance pre-configured with `withCredentials: true` to seamlessly handle authentication cookies automatically on every request.
- **State Management:** A hybrid approach using React Context API for global needs (Cart, Auth) and highly-localized `useState/useEffect` for component-specific data (Wishlists, Product Details) to reduce unnecessary re-renders.

### Backend Architecture (Server)
- **Core:** Node.js paired with Express.js to create a lightweight, high-performance RESTful API.
- **Database:** MongoDB Atlas (Cloud) managed via Mongoose ODM for strict schema validation and complex population queries.
- **Authentication:** `jsonwebtoken` for stateless auth, `cookie-parser` for HTTP header extraction.
- **Design Pattern:** Strict MVC (Model-View-Controller) separation of concerns.

---

## 📡 Complete REST API Documentation

### 🔐 Authentication (`/customers`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :---: |
| `POST` | `/customers/register` | Create a new customer account, hash password, and set cookie | Public |
| `POST` | `/customers/login` | Verify credentials and generate JWT HttpOnly cookie | Public |
| `GET` | `/customers/me` | Retrieve the authenticated customer's profile data | Private |
| `PATCH`| `/customers/change-password` | Verify old password and securely update to a new one | Private |
| `POST` | `/customers/logout` | Destroy the session and clear the HttpOnly cookie | Private |

### 📦 Products (`/products`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :---: |
| `GET` | `/products` | Fetch all products. Supports `?search`, `?category`, `?sort` | Public |
| `GET` | `/products/:id`| Fetch detailed information for a single product | Public |

### ❤️ Wishlist (`/wishlist`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :---: |
| `GET` | `/wishlist` | Fetch the authenticated customer's fully populated wishlist | Private |
| `POST` | `/wishlist/:productId`| Push a product ObjectId to the customer's wishlist array | Private |
| `DELETE`| `/wishlist/:productId`| Pull a product ObjectId from the customer's wishlist array | Private |

### 🛒 Cart (`/cart`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :---: |
| `GET` | `/cart` | Fetch the customer's cart, populated with product details | Private |
| `POST` | `/cart/:productId`| Add a product to the cart, or increment if it already exists | Private |
| `PATCH`| `/cart/:productId`| Explicitly set the quantity of a specific cart item | Private |
| `DELETE`| `/cart/:productId`| Completely remove a product from the cart array | Private |

---

## ⚙️ Local Development Guide

### 1. Prerequisites
Ensure your local development environment has the following installed:
- Node.js (v18.0.0 or higher)
- npm or yarn package manager
- A MongoDB Atlas connection URI (or a running local MongoDB instance)

### 2. Clone and Install
Clone the repository to your local machine, then install the dependencies for both the frontend and backend architectures:

```bash
# Clone the repository
git clone https://github.com/your-username/shopkart.git
cd shopkart

# Install Backend dependencies
cd backend
npm install

# Install Frontend dependencies
cd ../frontend
npm install
```

### 3. Environment Configuration
Create a `.env` file in the root of the `backend/` directory to store your secrets securely:

```env
# backend/.env
PORT=8000
dbUrl=mongodb+srv://<username>:<password>@cluster.mongodb.net/shopkart
JWT_SECRET=generate_a_very_secure_random_string_here
NODE_ENV=development
```

*(Note: In development, the Vite frontend is configured to proxy API requests or use a base Axios URL pointing directly to `http://localhost:8000`)*

### 4. Bootstrapping the Application
ShopKart requires two separate terminal instances to run the full stack concurrently.

**Terminal 1 (Booting the Server):**
```bash
cd backend
npm run dev
```

**Terminal 2 (Booting the Client):**
```bash
cd frontend
npm run dev
```

The frontend will compile and become accessible at `http://localhost:5173`, seamlessly communicating with the backend API listening on `http://localhost:8000`.

---
*Built with ❤️ as a modern e-commerce portfolio application. Focused on scalable architecture and premium design.*
