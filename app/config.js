import dotenv from "dotenv";
import path from "path";

dotenv.config();

export const envModule = {
  db_host: process.env.DB_HOST,
  db_port: process.env.DB_PORT,
  db_user: process.env.DB_USER,
  db_pass: process.env.DB_PASS,
  db_name: process.env.DB_NAME,
  secretKey: process.env.SECRET_KEY,
  rootPath: path.resolve(__dirname, ".."),
};
