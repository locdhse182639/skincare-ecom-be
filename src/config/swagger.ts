import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import path from "path";
import { Express } from "express";

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Skincare E-Commerce API",
      version: "1.0.0",
      description: "API documentation for the Skincare E-Commerce backend",
    },
    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [{ BearerAuth: [] }],
  },
  apis: [
    process.env.NODE_ENV === "production"
      ? path.join(__dirname, "../dist/routes/*.js") // Production
      : path.join(__dirname, "../routes/*.ts"), // Development
  ],
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

export const setupSwagger = (app: Express) => {
  console.log("Swagger is being initialized with routes from:", swaggerOptions.apis);
  console.log("Generated Swagger JSON:", JSON.stringify(swaggerSpec, null, 2));
  console.log(__dirname);

  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
