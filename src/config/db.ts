import mysql, { Pool } from "mysql2/promise";
import { env } from "./env";

const db: Pool = mysql.createPool({
  host: env.DB_HOST,
  port: Number(env.DB_PORT),
  database: env.DB_NAME,
  user: env.DB_USER,
  password: env.DB_PASS,
  queueLimit: 0,
  connectionLimit: 10,
  waitForConnections: true,
  timezone:"Z"
});

const checkConnection = async () => {
  try {
    const con = await db.getConnection();
    console.log(`mysql successfully connected to DB:${env.DB_NAME}`);
    
  } catch (err) {
    console.log("DB CONNECTION FAILED..",err)
  }
};
checkConnection()

export default db;
