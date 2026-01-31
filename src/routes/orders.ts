/**
 * @swagger
 * /orders:
 *   get:
 *     summary: Get all historic orders
 *     description: Returns all previous orders. Optional query parameter 'stock' to filter by stock symbol.
 *     parameters:
 *       - in: query
 *         name: stock
 *         schema:
 *           type: string
 *         required: false
 *         description: Filter orders by stock symbol
 *     responses:
 *       200:
 *         description: List of historic orders
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   stock:
 *                     type: string
 *                   amount:
 *                     type: number
 *                   shares:
 *                     type: number
 *                   type:
 *                     type: string
 *                     example: buy
 */
// src/routes/orders.ts
import { Router } from "express";
import { orders } from "../data";

const router = Router();

// GET /orders?stock=AAPL
router.get("/", (req, res) => {
  const { stock } = req.query;

  let result = orders;

  if (stock && typeof stock === "string") {
    result = orders.filter((o) => o.stock === stock);
  }

  res.json(result);
});

export default router;