import express from "express";
import multer from "multer";
import { index, single, store, update, destroy } from "./controller";

const router = express.Router();

// router
router.get("/categories", index);
router.get("/categories/:id", single);
router.post("/categories", multer().none(), store);
router.put("/categories/:id", multer().none(), update);
router.delete("/categories/:id", destroy);

export default router;
