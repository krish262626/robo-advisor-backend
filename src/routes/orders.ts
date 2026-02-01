/**
 * @swagger
 * /orders:
 *   get:
 *     summary: Get all historic orders
 *     description: Returns all previous orders. Optional query parameters to filter by stock symbol, userName, idempotencyKey, orderId, or status.
 *     parameters:
 *       - in: query
 *         name: stock
 *         schema:
 *           type: string
 *         required: false
 *         description: Filter orders by stock symbol
 *       - in: query
 *         name: userName
 *         schema:
 *           type: string
 *         required: false
 *         description: Filter orders by user name
 *       - in: query
 *         name: idempotencyKey
 *         schema:
 *           type: string
 *         required: false
 *         description: Filter orders by idempotency key
 *       - in: query
 *         name: orderId
 *         schema:
 *           type: number
 *         required: false
 *         description: Filter orders by order ID
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [accepted, executed]
 *         required: false
 *         description: Filter orders by status
 *     responses:
 *       200:
 *         description: List of historic orders matching the filters along with counts
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalCount:
 *                   type: number
 *                   description: Total number of orders before applying filters
 *                 resultCount:
 *                   type: number
 *                   description: Number of orders returned after applying filters
 *                 result:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       orderId:
 *                         type: number
 *                       itemId:
 *                         type: string
 *                         description: Unique identifier for the order item
 *                       userName:
 *                         type: string
 *                       stock:
 *                         type: string
 *                       amount:
 *                         type: number
 *                       shares:
 *                         type: number
 *                       price:
 *                         type: number
 *                         description: Price used for this stock
 *                       type:
 *                         type: string
 *                         example: buy
 *                       status:
 *                         type: string
 *                         example: accepted
 *                       timestamp:
 *                         type: string
 *                         format: date-time
 *                       executionDate:
 *                         type: string
 *                         format: date
 *                       idempotencyKey:
 *                         type: string
 */
import { Router } from "express";
import { orders } from "../data";

const router = Router();

router.get("/", (req, res) => {
  const { stock, userName, idempotencyKey, status, orderId } = req.query;

  let result = orders;
  const totalCount = result.length;
  if (stock && typeof stock === "string") {
    result = result.filter((o) => o.stock === stock);
  }
  if (userName && typeof userName === "string") {
    result = result.filter((o) => o.userName === userName);
  }
  if (idempotencyKey && typeof idempotencyKey === "string") {
    result = result.filter((o) => o.idempotencyKey === idempotencyKey);
  }
  if (status && typeof status === "string") {
    result = result.filter((o) => o.status === status);
  }
  if (orderId && typeof orderId === "number") {
    result = result.filter((o) => o.orderId === orderId);
  }
  const resultCount = result.length;
  let response = {
    totalCount,
    resultCount,
    result
  }
  res.json(
    response
  );
});

export default router;