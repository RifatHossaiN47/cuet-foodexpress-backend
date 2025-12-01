# 🍕 CUET FoodExpress - Backend Server

[![Node.js](https://img.shields.io/badge/Node.js-16+-green.svg)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-4.x-blue.svg)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-brightgreen.svg)](https://www.mongodb.com/)
[![Stripe](https://img.shields.io/badge/Stripe-Payment-blueviolet.svg)](https://stripe.com/)

> **Backend API server for CUET FoodExpress - A full-stack food ordering platform for CUET campus**

🔗 **Live API:** [https://cuet-foodexpress-server.vercel.app](https://cuet-foodexpress-server.vercel.app)  
🌐 **Frontend App:** [https://cuet-foodexpress-w3.firebaseapp.com](https://cuet-foodexpress-w3.web.app)  
📦 **Frontend Repo:** [cuet-foodexpress-frontend](https://github.com/RifatHossaiN47/cuet-foodexpress-frontend)

---

## 🎯 Overview

CUET FoodExpress Backend is a robust RESTful API server built with Node.js and Express.js for a modern food ordering system. It handles authentication, menu management, cart operations, payment processing, and admin functions with enterprise-level security.

**Key Capabilities:** 🔐 JWT + Firebase Auth | 💳 Stripe Payments | 📧 Email Notifications | 👥 Role-Based Access | 📊 Analytics Dashboard | 🛒 Cart Management

---

## ✨ Features

- ✅ **Authentication:** Email/Password + JWT + Firebase Google OAuth
- ✅ **User Management:** Registration, profile, admin promotion, role-based access
- ✅ **Menu Management:** Full CRUD with categories (Pizza, Salad, Soup, Dessert, Drinks)
- ✅ **Shopping Cart:** User-specific storage, auto-clear on payment
- ✅ **Payments:** Stripe integration with transaction history
- ✅ **Orders:** Creation, history, automated cart cleanup, email confirmations
- ✅ **Analytics:** Revenue stats, category-wise sales, user metrics
- ✅ **Reviews:** Customer feedback system
- ✅ **Security:** bcrypt hashing, JWT tokens, CORS, input validation

---

## 🛠️ Tech Stack

**Core:** Node.js, Express.js, MongoDB Atlas, Mongoose  
**Auth & Security:** JWT, bcrypt, CORS, dotenv  
**Payment & Email:** Stripe API, Mailgun

---

## 📡 API Endpoints

### Authentication

- `POST /login` - Email/password login
- `POST /jwt` - Generate JWT token
- `POST /users` - Register new user

### User Management

- `GET /users` - Get all users (Admin)
- `GET /user/admin/:email` - Check admin status
- `PATCH /users/admin/:id` - Promote to admin
- `DELETE /users/:id` - Delete user

### Menu Operations

- `GET /menu` - Get all menu items
- `GET /menu/:id` - Get single item
- `POST /menu` - Add item (Admin)
- `PATCH /menu/:id` - Update item (Admin)
- `DELETE /menu/:id` - Delete item (Admin)

### Cart Management

- `GET /carts?email={email}` - Get user cart
- `POST /carts` - Add to cart
- `DELETE /cart/:id` - Remove from cart

### Payment & Orders

- `POST /create-payment-intent` - Stripe payment intent
- `POST /payments` - Process payment
- `GET /payments/:email` - Payment history

### Reviews & Analytics

- `GET /review` - Get all reviews
- `POST /review` - Submit review
- `GET /admin-stats` - Dashboard stats (Admin)
- `GET /order-stats` - Sales data (Admin)

---

## 🚀 Installation

### Clone repository

git clone https://github.com/RifatHossaiN47/cuet-foodexpress-backend.git
cd cuet-foodexpress-backend

### Install dependencies

npm install

### Create .env file

cp .env.example .env

### Run development server

npm run dev

### Run production server

npm start

Server runs on: `http://localhost:5000`

---

## 🔐 Environment Variables

Create `.env` file in root:

PORT=5000
DB_USER=your_mongodb_username
DB_PASS=your_mongodb_password
ACCESS_TOKEN_SECRET=your_jwt_secret_min_32_chars
STRIPE_SECRET_KEY=sk_test_your_stripe_key
MAIL_GUN_API_KEY=your_mailgun_key
MAIL_SENDING_DOMAIN=your_mailgun_domain

**Get API Keys:**

- **MongoDB:** [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
- **Stripe:** [stripe.com](https://stripe.com) → Developers → API keys
- **Mailgun:** [mailgun.com](https://www.mailgun.com) → Settings → API Keys

---

## 📊 Database Schema

**Database:** `BistroDB`

### Collections:

**users**
{ \_id: ObjectId, name: String, email: String (unique), password: String (bcrypt), role: "user" | "admin" }

**menu**
{ \_id: ObjectId, name: String, recipe: String, image: String (URL), category: String, price: Number }

**carts**
{ \_id: ObjectId, email: String, menuItemId: ObjectId, name: String, price: Number }

**paymentCollection**
{ \_id: ObjectId, email: String, price: Number, transactionId: String, date: Date, cartIds: [ObjectId], menuItemIds: [ObjectId] }

---

## 🔒 Security

- ✅ bcrypt password hashing (10 salt rounds)
- ✅ JWT token authentication (1-hour expiry)
- ✅ Role-based access control (User/Admin)
- ✅ MongoDB ObjectId validation
- ✅ CORS configuration
- ✅ Environment variable protection

---

## 🚀 Deployment

### Vercel (Recommended)

npm install -g vercel
vercel login
vercel --prod

Add environment variables in Vercel Dashboard → Project Settings

### Heroku

heroku create cuet-foodexpress-server
git push heroku main
heroku config:set DB_USER=xxx DB_PASS=xxx

---

## 📈 API Usage Examples

**Login:**
const response = await fetch('https://cuet-foodexpress-server.vercel.app/login', {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify({ email: 'user@cuet.ac.bd', password: 'pass123' })
});

Returns: { success: true, token: 'jwt_token', user: {...} }

**Protected Request:**
const response = await fetch('https://cuet-foodexpress-server.vercel.app/admin-stats', {
headers: { 'Authorization': Bearer ${token} }
});

Returns: { users: 150, menuItems: 45, orders: 320, revenue: 15420.50 }

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

---

## 👨‍💻 Developer

**Md Rifat Hossen**  
📧 Email: rifat8851@gmail.com
🔗 GitHub: [@RifatHossaiN47](https://github.com/RifatHossaiN47)  
💼 LinkedIn: [Your Profile](https://linkedin.com/in/rifathossain47)

---

## 📞 Support

📧 Email: rifat8851@gmail.com
🐛 Issues: [GitHub Issues](https://github.com/RifatHossaiN47/cuet-foodexpress-backend/issues)

---

Made with ❤️ for CUET Students | ⭐ Star this repository if you find it helpful!

🔗 Links: [Live API](https://cuet-foodexpress-server.vercel.app) | [Frontend](https://cuet-foodexpress-w3.web.app) | [Frontend Repo](https://github.com/RifatHossaiN47/cuet-foodexpress-frontend)
