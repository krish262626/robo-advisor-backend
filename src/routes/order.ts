/**
 * @swagger
 * /order:
 *   post:
 *     summary: Place a buy or sell order for a model portfolio
 *     description: >
 *       Accepts a portfolio-based order request and calculates the allocated
 *       amount and number of shares per stock. Orders placed on non-market days
 *       are scheduled for the next market open day.
 *     tags:
 *       - Orders
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
 *               userName:
 *                 type: string
 *                 example: saikrishna
 *                 description: Optional user identifier
 *               type:
 *                 type: string
 *                 enum: [buy, sell]
 *                 example: sell
 *               amount:
 *                 type: number
 *                 example: 2300.543
 *               portfolio:
 *                 type: array
 *                 description: Portfolio allocation details
 *                 items:
 *                   type: object
 *                   required:
 *                     - stock
 *                     - weight
 *                   properties:
 *                     stock:
 *                       type: string
 *                       example: TSPL
 *                     weight:
 *                       type: number
 *                       description: Percentage allocation (0–100)
 *                       example: 100
 *                     price:
 *                       type: number
 *                       description: Optional stock price, defaults to 100 if not provided
 *                       example: 106
 *               idempotencyKey:
 *                 type: string
 *                 example: "5382519-5"
 *                 description: Unique key to prevent duplicate order submissions
 *     responses:
 *       200:
 *         description: Order accepted and processed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 orderId:
 *                   type: number
 *                   example: 2
 *                 userName:
 *                   type: string
 *                   example: saikrishna
 *                 status:
 *                   type: string
 *                   example: accepted
 *                 executionDate:
 *                   type: string
 *                   format: date
 *                   example: 2026-02-02
 *                 idempotencyKey:
 *                   type: string
 *                   example: "5382519-5"
 *                 orders:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       itemId:
 *                         type: string
 *                         example: f72b6339-ce81-4cf9-9be6-13cc36f2b215
 *                       stock:
 *                         type: string
 *                         example: TSPL
 *                       currency:
 *                         type: string
 *                         example: USD
 *                       amount:
 *                         type: number
 *                         example: 2300.543
 *                       shares:
 *                         type: number
 *                         example: 21.7032
 *                       price:
 *                         type: number
 *                         example: 106
 *                       timestamp:
 *                         type: string
 *                         format: date-time
 *                         example: 2026-02-01T08:47:46.357Z
 *       400:
 *         description: Invalid request payload
 */
import { Router } from "express";
import { v4 as uuidv4 } from "uuid";
import { getExecutionDate } from "../utils/helper";
import { PortfolioStock, Order, DEFAULT_PRICE, decimalPrecision, orders, idempotencyMap, generateOrderId } from "../data"
const router = Router();

router.post("/", (req, res) => {
  const { type, amount, portfolio, userName, idempotencyKey } = req.body;

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
    const stockAmount = parseFloat((amount * stock.weight/100).toFixed(decimalPrecision));
    const shares = parseFloat((stockAmount / stockPrice).toFixed(decimalPrecision));

    const order: Order = {
      orderId,
      itemId: uuidv4(),
      type,
      userName,
      currency: 'USD',
      stock: stock.stock,
      amount: stockAmount,
      shares,
      price: stockPrice,
      timestamp: new Date().toISOString(),
      executionDate,
      status,
      idempotencyKey,
    };

    orders.push(order);
    resultOrders.push(order);
  });

  // --- Response ---
  const response = {
    orderId,
    userName,
    status,
    executionDate,
    idempotencyKey,
    orders: resultOrders.map((o) => ({
      itemId: o.itemId,
      stock: o.stock,
      currency: o.currency,
      amount: o.amount,
      shares: o.shares,
      price: o.price,
      timestamp: o.timestamp
    }))
  }
  idempotencyMap.set(idempotencyKey, response);
  res.json(response);
});
export default router;
