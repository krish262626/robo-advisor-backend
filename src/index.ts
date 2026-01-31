import express from "express";
import orderRouter from "./routes/order";
import ordersRouter from "./routes/orders";
import configRouter from "./routes/config";
import { performanceLogger } from "./middleware/performance";
import { setupSwagger } from "./swagger";

const app = express();
app.use(express.json());

// --- Performance logging ---
app.use(performanceLogger);

// --- Routes ---
app.use("/order", orderRouter);
app.use("/orders", ordersRouter);
app.use("/config", configRouter);

// Swagger
setupSwagger(app);

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));