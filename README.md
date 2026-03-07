# 🍹 Blinkit Drinks – MERN Product Catalog

A full-stack **Blinkit-inspired drinks catalog** built with the MERN stack. Browse, search, filter drinks by category, manage a persistent cart, and place orders stored in MongoDB.

![Tech Stack](https://img.shields.io/badge/Stack-MERN-0c831f?style=for-the-badge)
![Frontend](https://img.shields.io/badge/Frontend-React%20%2B%20Vite-61dafb?style=for-the-badge&logo=react)
![Backend](https://img.shields.io/badge/Backend-Node.js%20%2B%20Express-339933?style=for-the-badge&logo=node.js)
![Database](https://img.shields.io/badge/Database-MongoDB-47a248?style=for-the-badge&logo=mongodb)

---

## 🌐 Live Demo

- **Frontend Application:** [https://blinkit-mern-assignment.vercel.app](https://blinkit-mern-assignment.vercel.app)
- **Backend API:** [https://blinkit-backend-xttf.onrender.com](https://blinkit-backend-xttf.onrender.com)
- **API Products Endpoint:** [https://blinkit-backend-xttf.onrender.com/api/products](https://blinkit-backend-xttf.onrender.com/api/products)

---

## ✨ Features

- 🛒 **Product Catalog** – Browse 50+ drinks across 8 categories
- 🔍 **Real-time Search** – Debounced search across name, brand, description
- 🏷️ **Category Filtering** – Soft Drinks, Juices, Energy Drinks, Water, Tea & Coffee, Dairy Drinks, Sports Drinks, Mocktails
- 📄 **Pagination** – 12 products per page with full navigation
- 🛍️ **Shopping Cart** – Add, remove, update quantity with localStorage persistence
- 💳 **Order Placement** – Sends order to backend, stores in MongoDB
- ✅ **Order Confirmation** – Live countdown delivery timer
- ⭐ **Loading Skeletons** – Smooth shimmer loading states
- 📱 **Responsive Design** – Works on mobile, tablet, desktop
- 🔔 **Toast Notifications** – Add to cart, order success feedback
- 🏃 **Stock Indicator** – "Only X left!" and "Out of Stock" badges

---

## 📸 Project Preview

### Home Page
![Home](./screenshots/home.png)

### Product Page
![Product](./screenshots/product.png)

### Cart Page
![Cart](./screenshots/cart.png)

### Order Confirmation
![Order](./screenshots/order.png)

---

## 🏗️ Architecture

```
Frontend (React + Vite)
       ↓
  Axios API Calls
       ↓
Backend (Node.js + Express)
       ↓
   MongoDB Atlas
```

---

## 📁 Project Structure

```
blinkit-mern-assignment/
│
├── frontend/                  # React + Vite app
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── ProductCard.jsx
│   │   │   ├── CategoryFilter.jsx
│   │   │   ├── CartItem.jsx
│   │   │   └── Skeleton.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── ProductDetails.jsx
│   │   │   ├── Cart.jsx
│   │   │   └── OrderConfirmation.jsx
│   │   ├── context/
│   │   │   └── CartContext.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── .env
│
├── backend/                   # Node.js + Express API
│   ├── config/
│   │   └── db.js
│   ├── models/
│   │   ├── Product.js
│   │   └── Order.js
│   ├── controllers/
│   │   ├── productController.js
│   │   └── orderController.js
│   ├── routes/
│   │   ├── productRoutes.js
│   │   └── orderRoutes.js
│   ├── seed/
│   │   └── seedProducts.js
│   ├── server.js
│   └── .env
│
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (or local MongoDB)

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/blinkit-mern-assignment.git
cd blinkit-mern-assignment
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create `.env`:
```env
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/blinkit-db
PORT=5000
```

Seed the database:
```bash
npm run seed
```

Start the server:
```bash
npm run dev
```

### 3. Frontend Setup

```bash
cd frontend
npm install
```

Create `.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

Start the dev server:
```bash
npm run dev
```

Open: **http://localhost:5173**

---

## 🔌 API Endpoints

### Products

| Method | Route | Description |
|--------|-------|-------------|
| `GET` | `/api/products` | Get all products (with filtering) |
| `GET` | `/api/products/:id` | Get single product |
| `GET` | `/api/products/categories` | Get all categories |
| `POST` | `/api/products` | Create a product |
| `PUT` | `/api/products/:id` | Update a product |
| `DELETE` | `/api/products/:id` | Delete a product |

**Query Parameters for `GET /api/products`:**
- `page` – Page number (default: 1)
- `limit` – Items per page (default: 12)
- `category` – Filter by category
- `search` – Search by name/brand/description
- `sort` – Sort field (default: createdAt)
- `order` – `asc` or `desc`
- `minPrice` / `maxPrice` – Price range filter
- `featured` – `true` for featured products only

**Example:**
```
GET /api/products?page=1&limit=12&category=Juices&search=mango
```

### Orders

| Method | Route | Description |
|--------|-------|-------------|
| `GET` | `/api/orders` | Get all orders |
| `GET` | `/api/orders/:id` | Get order by ID |
| `POST` | `/api/orders` | Create a new order |

**Create Order Payload:**
```json
{
  "items": [
    { "productId": "abc123", "name": "Coca-Cola", "price": 40, "quantity": 2, "image": "..." }
  ],
  "totalAmount": 80,
  "paymentMethod": "COD"
}
```

---

## 🗄️ Database Schemas

### Product
| Field | Type | Description |
|-------|------|-------------|
| `name` | String | Product name |
| `price` | Number | Current price |
| `originalPrice` | Number | MRP for discount display |
| `category` | String | One of 8 categories |
| `image` | String | Image URL |
| `description` | String | Product description |
| `stock` | Number | Available stock |
| `unit` | String | e.g. "750ml", "1L" |
| `brand` | String | Brand name |
| `rating` | Number | 0-5 star rating |
| `reviewCount` | Number | Number of reviews |
| `isFeatured` | Boolean | Featured product flag |

### Order
| Field | Type | Description |
|-------|------|-------------|
| `items` | Array | List of order items |
| `totalAmount` | Number | Grand total |
| `status` | String | pending/confirmed/delivered |
| `paymentMethod` | String | COD/Online |

---

## 🌐 Deployment

### Frontend → Vercel
```bash
cd frontend
npm run build
# Push to GitHub, connect to Vercel
# Set VITE_API_URL env variable to your Render backend URL
```

### Backend → Render
1. Push to GitHub
2. Create new Web Service on Render
3. Set environment variables:
   - `MONGO_URI` = your Atlas URI
   - `PORT` = 10000
   - `FRONTEND_URL` = your Vercel URL

---

## 📦 Drink Categories (50+ Products)

| Category | Examples |
|----------|---------|
| 🥤 Soft Drinks | Coca-Cola, Pepsi, Sprite, Mountain Dew, Thums Up |
| 🍊 Juices | Tropicana, Real, Frooti, Appy Fizz, Paper Boat |
| ⚡ Energy Drinks | Red Bull, Monster, Sting, Hell |
| 💧 Water | Bisleri, Evian, Kinley, Qua Sparkling |
| ☕ Tea & Coffee | Starbucks Cold Brew, Nestea, Chaayos Masala Chai |
| 🥛 Dairy Drinks | Amul Kool, Epigamia Lassi, Mother Dairy Chaas |
| 🏃 Sports Drinks | Gatorade, Powerade |
| 🍹 Mocktails | Svami, Raw Pressery, B-Fizz, Pina Colada |

---

## 🔮 Future Improvements

- [ ] User authentication (JWT)
- [ ] Wishlist / Favourites
- [ ] Admin dashboard (add/edit/delete products)
- [ ] Order tracking with status updates
- [ ] Payment gateway integration (Razorpay)
- [ ] Product reviews and ratings system
- [ ] Push notifications for order updates

---

## 👨‍💻 Author

Built with ❤️ as a MERN assignment project.

> **Note:** This project was built as part of a MERN stack internship assignment to demonstrate full-stack e-commerce capabilities.
