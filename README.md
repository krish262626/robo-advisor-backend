# Robo Advisor Backend

A backend service for a simple robo-advisor order management system.  
Built with **Node.js / TypeScript** to demonstrate API design, flexible portfolio allocation, market day handling, and robust backend patterns.

---

## 📌 Overview

This service provides REST endpoints to:

1. Create a portfolio order with split allocation  
2. Fetch historic orders  

It correctly:
- Allocates funds based on % shares in portfolio
- Handles variable stock price (default $100 if not provided)
- Calculates quantity based on config decimal precision
- Schedules execution only on market open days (Mon–Fri)
- Logs response time for each API call

---

## 📁 API Endpoints

### 📌 POST `/orders`
Create and submit a new portfolio order.

**Request**
```json
{
  "orderType": "BUY",
  "amount": 100,
  "portfolio": [
    { "symbol": "AAPL", "percentage": 60, "price": 150 },
    { "symbol": "TSLA", "percentage": 40 }
  ]
}
