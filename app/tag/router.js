import express from "express";
import multer from "multer";
import { index, single, store, update, destroy } from "./controller";

const router = express.Router();

// router
router.get("/tags", index);
router.get("/tags/:id", single);
router.post("/tags", multer().none(), store);
router.put("/tags/:id", multer().none(), update);
router.delete("/tags/:id", destroy);

export default router;
