/**
 * @swagger
 * /order:
 *   post:
 *     summary: Place buy or sell orders for a model portfolio
 *     description: Calculates amount and number of shares for each stock based on portfolio weights and current stock price.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - type
 *               - amount
 *               - portfolio
 *               - idempotencyKey
 *             properties:
 *               userId:
 *                 type: string
 *                 example: "user123"
 *                 description: Optional user identifier
 *               type:
 *                 type: string
 *                 enum: [buy, sell]
 *                 example: buy
 *               amount:
 *                 type: number
 *                 example: 100
 *               portfolio:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     stock:
 *                       type: string
 *                       example: AAPL
 *                     weight:
 *                       type: number
 *                       example: 0.6
 *                     price:
 *                       type: number
 *                       example: 105
 *               idempotencyKey:
 *                 type: string
 *                 example: "f3a8b7c4-9d2e-4d9b-a7d1-123456789abc"
 *                 description: Unique key prevent duplicate orders
 *     responses:
 *       200:
 *         description: Order calculation successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 itemId:
 *                   type: string
 *                 userId:
 *                   type: string
 *                 status:
 *                   type: string
 *                   example: executed
 *                 executionDate:
 *                   type: string
 *                 orders:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       stock:
 *                         type: string
 *                       amount:
 *                         type: number
 *                       shares:
 *                         type: number
 *                       price:
 *                         type: number
 *       400:
 *         description: Invalid request
 *       409:
 *         description: Duplicate order detected
 */

// src/routes/order.ts
import { Router } from "express";
import { v4 as uuidv4 } from "uuid";
import { getExecutionDate } from "../utils/helper";
import { PortfolioStock, Order, DEFAULT_PRICE, decimalPrecision, orders, idempotencyMap, generateOrderId } from "../data"
import { timeStamp } from "node:console";

const router = Router();

router.post("/", (req, res) => {
  const { type, amount, portfolio, userId, idempotencyKey } = req.body;

  // --- Basic Validation ---
  if (!type || !["buy", "sell"].includes(type.toLowerCase())) {
    return res.status(400).json({ error: "Invalid type. Must be 'buy' or 'sell'" });
  }
  if (!amount || amount <= 0) {
    return res.status(400).json({ error: "Amount must be greater than 0" });
  }
  if (!portfolio || !Array.isArray(portfolio) || portfolio.length === 0) {
    return res.status(400).json({ error: "Portfolio must be a non-empty array" });
  }

  if (!idempotencyKey || typeof idempotencyKey !== "string") {
    return res.status(400).json({ error: "idempotencyKey is required and must be a string" });
  }

  if (idempotencyMap.has(idempotencyKey)) {
    return res.json(idempotencyMap.get(idempotencyKey)); // return old response
  }

  // --- Weight Validation ---
  const totalWeight = portfolio.reduce((sum: number, s: PortfolioStock) => sum + s.weight, 0);
  if (Math.abs(totalWeight - 100) > 0.01) {
    return res.status(400).json({ error: "Total portfolio weights must sum to 100%" });
  }

  // --- Determine execution status ---
  const today = new Date();
  const day = today.getDay(); // 0 = Sunday, 6 = Saturday
  const status = day === 0 || day === 6 ? "accepted" : "executed";
  const executionDate = getExecutionDate();

  // --- Generate per-stock orders ---
  const resultOrders: Order[] = [];
  const orderId = generateOrderId();
  portfolio.forEach((stock: PortfolioStock) => {
    const stockPrice = stock.price ?? DEFAULT_PRICE;
    const stockAmount = parseFloat((amount * stock.weight/100).toFixed(2));
    const shares = parseFloat((stockAmount / stockPrice).toFixed(decimalPrecision));

    const order: Order = {
      orderId,
      itemId: uuidv4(),
      type,
      userId,
      stock: stock.stock,
      amount: stockAmount,
      shares,
      price: stockPrice,
      timestamp: new Date().toISOString(),
      status,
      idempotencyKey,
    };

    orders.push(order);
    resultOrders.push(order);
  });

  // --- Response ---
  const response = {
    orderId,
    userId,
    status,
    executionDate,
    idempotencyKey,
    orders: resultOrders.map((o) => ({
      itemId: o.itemId,
      stock: o.stock,
      amount: o.amount,
      shares: o.shares,
      price: o.price,
      timeStamp: o.timestamp
    }))
  }
  idempotencyMap.set(idempotencyKey, response);
  res.json(response);
});
export default router;
