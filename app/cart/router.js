import express from "express";
import multer from "multer";
import { index, update } from "./controller";

const router = express.Router();

// router
router.get("/carts", index);
router.put("/carts", multer().none(), update);

export default router;
