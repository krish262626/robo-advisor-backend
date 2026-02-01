# Robo Advisor Backend

A backend API service for a simple **robo-advisor order management system**.  
This service accepts investment orders, splits them into portfolio allocations, calculates share quantities, and handles next market day scheduling.

Built using **Node.js, TypeScript, and Express**, with a focus on clean architecture and clarity.

---

## 📌 Features

✔ Create portfolio orders with allocation split  
✔ Fetch historic orders  
✔ In-memory storage (as per assessment requirement)  
✔ Market open day handling (Mon–Fri only)  
✔ Configurable decimal precision for quantities  
✔ Request response-time logging via middleware  
✔ Designed with production-readiness in mind  

---

## 📦 Tech Stack

| Layer | Technology |
|------|-----------|
| Language | TypeScript |
| Server | Express.js |
| Runtime | Node.js |
| ID Generation | uuid |
| Storage | In-memory (Array) |
| Dev Tooling | nodemon |
| Logging | Lightweight custom middleware |

---
## 🔗 API Endpoints

### Create Order
POST /order

Request Example:
```json
{
  "userName": "user123",
  "type": "buy",
  "amount": 100,
  "portfolio": [
    {
      "stock": "AAPL",
      "weight": 0.6,
      "price": 105
    }
  ],
  "idempotencyKey": "f3a8b7c4-9d2e-4d9b-a7d1-123456789abc"
}
Response Example:
{
  "orderId": 2,
  "userName": "saikrishna",
  "status": "accepted",
  "executionDate": "2026-02-02",
  "idempotencyKey": "5382519-5",
  "orders": [
    {
      "itemId": "f72b6339-ce81-4cf9-9be6-13cc36f2b215",
      "stock": "TSPL",
      "amount": 2300.543,
      "shares": 21.7032,
      "price": 106,
      "timestamp": "2026-02-01T08:47:46.357Z"
    }
  ]
}

---

**## 🧠 Business Logic**

### ⭐ Default Price
If a stock price is not provided, the system defaults it to **$100**.

### ⭐ Quantity Calculation
- Amount per stock = (percentage / 100) × total amount  
- Quantity = allocated amount / stock price  
- Decimal precision is configurable

### ⭐ Market Scheduling
- Orders placed on **Saturday or Sunday** are scheduled for the **next Monday**
- Markets are considered open only on weekdays

---

## 🛠 Installation & Running

### 1. Clone the repository
```bash
git clone https://github.com/krish262626/robo-advisor-backend.git
cd robo-advisor-backend
2. Install dependencies
npm install
3. Run in development mode
npm run dev
Server runs on:

http://localhost:3000
🧪 Testing Recommendations
Although not required for this assessment, the following tests can be added:

Portfolio allocation calculations

Market day logic

Validation and error scenarios

Frameworks like Jest or Supertest can be used.

📌 Production-Level Improvements
The following enhancements would be added in a real production setup:

🔹 Database Integration
Example: PostgreSQL / MongoDB
Value: Enables data persistence, indexing, and scalable querying.

🔹 Logging & Monitoring
For this assessment, a lightweight response-time logger is implemented.

In a production environment, this can be extended with:

Structured logging (Winston / Pino)

Centralized monitoring and observability (Prometheus / Grafana)

These were intentionally scoped out to keep the assessment focused on
core business logic and API design, as no infrastructure setup was required.

📌 Assumptions
✔ In-memory storage is acceptable
✔ Default stock price is used when not provided
✔ Decimal precision is configurable
✔ Market days exclude weekends
