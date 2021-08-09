import express from "express";
import multer from "multer";
import { index, store, update, destroy } from "./controller";

const router = express.Router();

// router
router.get("/delivery-address", index);
router.post("/delivery-address", multer().none(), store);
router.put("/delivery-address/:id", multer().none(), update);
router.delete("/delivery-address/:id", destroy);

export default router;
