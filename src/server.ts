import { Application } from "express";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import db from "./config/db";
import { env } from "./config/env";
import routes from "./routes/v1"
import { getCurrentUser } from "./modules/auth/auth.controller";

dotenv.config();
const app:Application = express();

//MIDDLEWARES
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin:
      (env.CLIENT_URL_DEVELOPMENT) ||
      (env.CLIENT_URL_PRODUCTION),
    credentials: true,
  }),
);

db

//SWAGGER 
// app.use(
//   "/api-docs",
//   swaggerUi.serve,
//   swaggerUi.setup(swaggerSpec)
// );


//ROUTES
app.use("/api/v1",routes)
app.get("/",getCurrentUser)
app.use(express.static("public"));



const PORT = process.env.PORT as string
app.listen(PORT, () => {
  console.log(`SERVER LISTENING TO http://localhost:${PORT}
`);
});
