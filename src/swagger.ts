// src/swagger.ts
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Robo-Advisor Backend API",
      version: "1.0.0",
      description: "APIs for order splitter, historic orders, and config endpoints",
    },
    servers: [
      { url: "http://localhost:3000", description: "Local server" },
    ],
  },
  apis: ["./src/routes/*.ts"], // scan route files for JSDoc comments
};

const swaggerSpec = swaggerJSDoc(options);

export function setupSwagger(app: Express) {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}