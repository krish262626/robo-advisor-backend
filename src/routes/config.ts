/**
 * @swagger
 * /config/precision:
 *   post:
 *     summary: Update decimal precision for shares
 *     description: Sets how many decimal places are used when calculating the number of shares.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - decimals
 *             properties:
 *               decimals:
 *                 type: number
 *                 example: 6
 *     responses:
 *       200:
 *         description: Precision updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 decimals:
 *                   type: number
 *   get:
 *     summary: Get current decimal precision
 *     description: Returns the current decimal precision used for share calculations.
 *     responses:
 *       200:
 *         description: Current decimal precision
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 decimals:
 *                   type: number
 *                   example: 6
 */
// src/routes/config.ts
import { Router } from "express";
import { decimalPrecision } from "../data";

const router = Router();

// POST /config/precision
router.post("/precision", (req, res) => {
  const { decimals } = req.body;

  if (decimals === undefined || typeof decimals !== "number" || decimals < 0) {
    return res.status(400).json({ error: "Invalid 'decimals'. Must be a non-negative number." });
  }

  // @ts-ignore
  decimalPrecision = decimals;

  res.json({ success: true, decimals });
});

router.get("/precision", (req, res) => {
  res.json({ decimals: decimalPrecision });
});

export default router;