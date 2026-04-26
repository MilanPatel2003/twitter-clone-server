import dotenv from "dotenv";

dotenv.config();

export const env = {
  PORT: process.env.PORT!,

  SERVER_URL_DEVELOPMENT:process.env.SERVER_URL_DEVELOPMENT!,
  SERVER_URL_PRODUCTION:process.env.SERVER_URL_PRODUCTION!,
  CLIENT_URL_DEVELOPMENT:process.env.CLIENT_URL_DEVELOPMENT!,
  CLIENT_URL_PRODUCTION:process.env.CLIENT_URL_PRODUCTION!,

  DB_PORT:process.env.DB_PORT!,
  DB_HOST: process.env.DB_HOST!,
  DB_USER: process.env.DB_USER!,
  DB_PASS: process.env.DB_PASS!,
  DB_NAME: process.env.DB_NAME!,

  JWT_SECRET: process.env.JWT_SECRET!,
  JWT_EXPIRY: process.env.JWT_EXPIRY!,

  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME!,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY!,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET!,
};
