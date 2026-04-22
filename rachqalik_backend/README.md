# Rachqalik Backend

Backend API for Rachqalik (smart sleep platform) built with Node.js, Express, MongoDB, and JWT authentication.

## Tech Stack
- Node.js
- Express.js
- MongoDB Atlas + Mongoose
- JWT Authentication
- bcryptjs
- dotenv
- cors

## Project Structure

server/
├── models/
├── controllers/
├── routes/
├── middleware/
├── config/
└── server.js

## Setup
1. Copy `.env.example` to `.env`
2. Update `JWT_SECRET` with a strong value
3. Install dependencies and run:

```bash
npm install
npm run dev
```

## Optional Seed
```bash
npm run seed
```

## API Endpoints
### Auth
- POST `/api/auth/register`
- POST `/api/auth/login`

### Products
- GET `/api/products`
- POST `/api/products` (admin only)

### Orders
- POST `/api/orders` (auth required)
- GET `/api/orders/user/:id` (owner or admin)

### Sleep
- POST `/api/sleep` (auth + active free trial/premium)
- GET `/api/sleep/user/:id` (owner/admin + active free trial/premium)

## Freemium Logic
- New users start with `free`
- Free plan access expires after 15 days
- `premium` plan unlocks full access
