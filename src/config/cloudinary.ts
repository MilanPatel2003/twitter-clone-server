import { v2 as cloudinary } from "cloudinary";
import { env } from "./env";

cloudinary.config({
  // cloud_name:env.CLOUDINARY_CLOUD_NAME,
  // api_key:env.CLOUDINARY_API_KEY,
  // api_secret:env.CLOUDINARY_API_SECRET

  cloud_name: "ddjqhdvrk",
  api_key: "267889394599989",
  api_secret: "2tz48_ie8nFv8eahymlqFcOZB4I",
});

export default cloudinary;
