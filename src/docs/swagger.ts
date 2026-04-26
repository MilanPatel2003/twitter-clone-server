import swaggerJsdoc from "swagger-jsdoc";
import { env } from "../config/env";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Twitter Clone API",
      version: "1.0.0",
      description: "Backend API docs",
    },
    servers: [
      {
        url: `${env.SERVER_URL_DEVELOPMENT}/api/v1`,
      },
    ],
  },
  apis: ["./src/modules/**/*.ts"],
};

export const swaggerSpec = swaggerJsdoc(options);
